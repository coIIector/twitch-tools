import React, { Component } from "react"
// import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"

import { Navbar, Nav, Form, Button, Container, Row, Col } from "react-bootstrap"

const TWITCH_CLIENT_ID = "jzkbprff40iqj646a697cyrvl0zt2m6"

const twitchApi = async (url, params) => {
  const entries = []

  for (const entry of Object.entries(params)) {
    const value = entry[1]
    if (Array.isArray(value)) {
      for (const e of value) {
        entries.push([entry[0], e])
      }
    } else {
      entries.push(entry)
    }
  }

  const response = await fetch(
    `https://api.twitch.tv${url}?${new URLSearchParams(
      entries.filter(([, value]) => value !== undefined)
    )}`,
    {
      referrer: "no-referrer",
      mode: "cors",
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
      },
    }
  )

  const json = await response.json()
  console.log(json)
  return json
}

const USER_LOGIN_TO_ID = {}
const USER_LOGIN_TO_VODS = {}

const getUserIds = async logins => {
  const loginsToQuery = logins.filter(function(login) {
    return !(login in USER_LOGIN_TO_ID)
  })

  if (loginsToQuery.length === 0) return 0

  const data = await twitchApi("/helix/users", { login: loginsToQuery })
  for (const user of data.data) {
    USER_LOGIN_TO_ID[user.login.toLowerCase()] = user.id
  }
  return data.data.length
}

const getVodsByLogin = async login => {
  if (login in USER_LOGIN_TO_VODS) return USER_LOGIN_TO_VODS[login.toLowerCase()]

  await getUserIds([login])
  const user_id = USER_LOGIN_TO_ID[login.toLowerCase()]
  if (!user_id) return null
  // todo: more than 100
  const data = await twitchApi("/helix/videos", { user_id, first: 100, type: "archive" })
  if (data.error) return null

  const vods = data.data.sort(sortVod)
  USER_LOGIN_TO_VODS[login] = vods
  return vods
}

const sortVod = (a, b) => {
  return b.created_at.localeCompare(a.created_at)
}

const findVodByLoginAndDate = async (login, date) => {
  const vods = await getVodsByLogin(login)
  if (!vods) return null

  let resVod = null,
    nextVod = null,
    prevVod = null

  // iterate from newest to oldest
  for (const vod of vods) {
    const startTime = new Date(vod.created_at)
    if (startTime > date) {
      nextVod = vod
      continue
    }

    const [, hours, minutes, seconds] = vod.duration.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/)
    const duration =
      parseInt(hours || "0") * 60 * 60 + parseInt(minutes || "0") * 60 + parseInt(seconds || "0")
    const endTime = new Date(startTime.getTime() + duration * 1000)

    if (endTime < date) {
      prevVod = vod
      break
    }

    resVod = vod
    break
  }

  return { vod: resVod, nextVod, prevVod }
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      login: "",
      dateString: "",
      date: null,
      vod: null,
      error: false,
    }
  }

  handleChange = e => {
    let field = e.target.id
    let value = (e.target.value || "").toLowerCase()

    this.setState({ [field]: value })
  }

  handleClick = async e => {
    const date = new Date(this.state.dateString)
    this.setState({ error: false })
    if (isNaN(date)) return

    this.setState({ date })

    const vod = await findVodByLoginAndDate(this.state.login, date)
    this.setState({ vod, error: !vod })
  }

  results = () => {
    if (this.state.error) return <p>Error...</p>

    if (this.state.vod) {
      const { vod, nextVod, prevVod } = this.state.vod

      if (vod) {
        let url = vod.url
        const diff = Math.floor(
          (this.state.date.getTime() - new Date(vod.created_at).getTime()) / 1000
        )

        const param = "?t=" + diff + "s"
        return <a href={url + param}> VOD found! </a>
      }

      return <p> No VOD found </p>
    }

    return null
  }

  render() {
    return (
      <>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="/">Twitch Tools</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">VoD timestamp</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Container fluid>
          <Row>
            <Col sm="2" />
            <Col sm="10">
              <h1>VOD timestamp</h1>

              <p>Find VOD timestamp by date</p>

              <Form>
                <Form.Group controlId="login">
                  <Form.Label>Twitch Login</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ninja"
                    onChange={this.handleChange}
                    value={this.state.login}
                  />
                </Form.Group>
                <Form.Group controlId="dateString">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="2020-02-02 12:34:56 UTC"
                    onChange={this.handleChange}
                    value={this.state.dateString}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  disabled={!this.state.login || !this.state.dateString}
                  onClick={this.handleClick}
                >
                  GO
                </Button>
                <div>{this.results()}</div>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default App
