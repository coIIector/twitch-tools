(this["webpackJsonptwitch-tools"]=this["webpackJsonptwitch-tools"]||[]).push([[0],{29:function(e,t,a){e.exports=a(39)},34:function(e,t,a){},39:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(10),o=a.n(l),s=(a(34),a(28)),i=(a(35),a(46)),c=a(47),u=a(42),d=a(43),h=a(27),m=a(45),f=a(44);const p=async(e,t)=>{const a=[];for(const l of Object.entries(t)){const e=l[1];if(Array.isArray(e))for(const t of e)a.push([l[0],t]);else a.push(l)}const n=await fetch("https://api.twitch.tv".concat(e,"?").concat(new URLSearchParams(a.filter(([,e])=>void 0!==e))),{referrer:"no-referrer",mode:"cors",headers:{"Client-ID":"jzkbprff40iqj646a697cyrvl0zt2m6"}}),r=await n.json();return console.log(r),r},g={},E={},v=async e=>{if(e in E)return E[e.toLowerCase()];await(async e=>{const t=e.filter((function(e){return!(e in g)}));if(0===t.length)return 0;const a=await p("/helix/users",{login:t});for(const n of a.data)g[n.login.toLowerCase()]=n.id;return a.data.length})([e]);const t=g[e.toLowerCase()];if(!t)return null;const a=await p("/helix/videos",{user_id:t,first:100,type:"archive"});if(a.error)return null;const n=a.data.sort(w);return E[e]=n,n},w=(e,t)=>t.created_at.localeCompare(e.created_at);class C extends n.Component{constructor(e){super(e),this.handleChange=e=>{let t=e.target.id,a=(e.target.value||"").toLowerCase();this.setState({[t]:a})},this.handleClick=async e=>{const t=new Date(this.state.dateString);if(this.setState({error:!1}),isNaN(t))return;this.setState({date:t});const a=await(async(e,t)=>{const a=await v(e);if(!a)return null;let n=null,r=null,l=null;for(const o of a){const e=new Date(o.created_at);if(e>t){r=o;continue}const a=o.duration.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/),i=Object(s.a)(a,4),c=i[1],u=i[2],d=i[3],h=60*parseInt(c||"0")*60+60*parseInt(u||"0")+parseInt(d||"0");if(new Date(e.getTime()+1e3*h)<t){l=o;break}n=o;break}return{vod:n,nextVod:r,prevVod:l}})(this.state.login,t);this.setState({vod:a,error:!a})},this.results=()=>{if(this.state.error)return r.a.createElement("p",null,"Error...");if(this.state.vod){const e=this.state.vod,t=e.vod;e.nextVod,e.prevVod;if(t){let e=t.url;const a="?t="+Math.floor((this.state.date.getTime()-new Date(t.created_at).getTime())/1e3)+"s";return r.a.createElement("a",{href:e+a}," VOD found! ")}return r.a.createElement("p",null," No VOD found ")}return null},this.state={login:"",dateString:"",date:null,vod:null,error:!1}}render(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(i.a,{bg:"light",expand:"lg"},r.a.createElement(i.a.Brand,{href:"/"},"Twitch Tools"),r.a.createElement(i.a.Toggle,{"aria-controls":"basic-navbar-nav"}),r.a.createElement(i.a.Collapse,{id:"basic-navbar-nav"},r.a.createElement(c.a,{className:"mr-auto"},r.a.createElement(c.a.Link,{href:"/"},"VoD timestamp")))),r.a.createElement(u.a,{fluid:!0},r.a.createElement(d.a,null,r.a.createElement(h.a,{sm:"2"}),r.a.createElement(h.a,{sm:"10"},r.a.createElement("h1",null,"VOD timestamp"),r.a.createElement("p",null,"Find VOD timestamp by date"),r.a.createElement(m.a,null,r.a.createElement(m.a.Group,{controlId:"login"},r.a.createElement(m.a.Label,null,"Twitch Login"),r.a.createElement(m.a.Control,{type:"text",placeholder:"ninja",onChange:this.handleChange,value:this.state.login})),r.a.createElement(m.a.Group,{controlId:"dateString"},r.a.createElement(m.a.Label,null,"Date"),r.a.createElement(m.a.Control,{type:"text",placeholder:"2020-02-02 12:34:56 UTC",onChange:this.handleChange,value:this.state.dateString})),r.a.createElement(f.a,{variant:"primary",disabled:!this.state.login||!this.state.dateString,onClick:this.handleClick},"GO"),r.a.createElement("div",null,this.results()))))))}}var b=C;o.a.render(r.a.createElement(b,null),document.getElementById("root"))}},[[29,1,2]]]);
//# sourceMappingURL=main.bcc4e245.chunk.js.map