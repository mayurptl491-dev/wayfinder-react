import {FX} from '../data/destinations.js';
/* ---------- cost model (planning estimates, not live fares) ---------- */
const rad=x=>x*Math.PI/180;
function km(a,b){const dl=rad(b.lat-a.lat),dn=rad(b.lon-a.lon);const h=Math.sin(dl/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dn/2)**2;return 12742*Math.asin(Math.sqrt(h))}
function routes(o,d){
  const dist=km(o,d);
  if(dist<80)return {dist,local:true,modes:[]};
  const dom=o.cc==='IN'&&d.cc==='IN', modes=[];
  if(dom&&!d.noGround&&dist<2600){
    modes.push({id:'train',label:'Train',hrs:dist/62+1,usd:[Math.max(200,dist*0.6)/FX.INR,Math.max(500,dist*2.3)/FX.INR],sub:'Sleeper to 2AC class'});
  }
  if(dom&&!d.noGround&&dist<1600){
    modes.push({id:'bus',label:'Bus',hrs:dist/45+0.5,usd:[Math.max(150,dist*0.9)/FX.INR,Math.max(400,dist*1.8)/FX.INR],sub:'Seater to sleeper coach'});
  }
  if(!d.noFlight&&dist>=250){
    let b=35+0.05*Math.min(dist,3000)+0.04*Math.max(dist-3000,0); if(dom)b*=0.6;
    modes.push({id:'flight',label:'Flight',hrs:dist/800+1.6+(dist>8500?3:0)+(d.viaHub?1.5:0),usd:[b*0.8,b*1.7],sub:(dist>8500||d.viaHub)?'Usually with a connection, economy':'Economy, nonstop or one stop'});
  }
  modes.sort((a,b)=>a.usd[0]-b.usd[0]);
  return {dist,local:false,modes};
}
const hrs=h=>{const t=Math.round(h*60);const hh=Math.floor(t/60),mm=t%60;return hh+'h'+(mm?(' '+mm+'m'):'')};

export {km,routes,hrs};
