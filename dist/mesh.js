// Ordered halftone orbital ribbon. The curved surface controls dot size and
// alpha on a fixed screen, leaving the centre quiet for reading.
const screen = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
export function meshDots(width,height){
 const dots=[],step=8;
 for(let row=0,y=step/2;y<height;row++,y+=step){
  for(let col=0,x=step/2;x<width;col++,x+=step){
   const u=x/width-.5,v=y/height-.53;
   const dx=u*.94+v*.34,dy=-u*.34+v*.94;
   const angle=Math.atan2(dy/.51,dx/.64);
   const radius=Math.hypot(dx/.64,dy/.51);
   const contour=.93+.065*Math.sin(angle*2-.6);
   const band=(radius-contour)/.19;
   if(Math.abs(band)>=1)continue;
   const surface=Math.sqrt(1-band*band);
   const lighting=.62+.38*(.5+.5*Math.sin(angle-1.1));
   const quietCentre=1-Math.exp(-Math.pow(u/.32,4)-Math.pow(v/.29,4));
   const intensity=surface*lighting*quietCentre;
   const level=intensity*5,threshold=(screen[(row%4)*4+col%4]+.5)/16;
   const quantized=Math.floor(level)+(level%1>threshold?1:0);
   if(!quantized)continue;
   dots.push({x,y,r:.3+quantized*.33,alpha:.075+intensity*.13});
  }
 }
 return dots;
}
export function mountMesh(canvas){
 let timer;
 const draw=()=>{
  const box=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.max(1,Math.round(box.width*ratio));
  canvas.height=Math.max(1,Math.round(box.height*ratio));
  const ctx=canvas.getContext('2d');ctx.scale(ratio,ratio);
  for(const dot of meshDots(box.width,box.height)){
   ctx.beginPath();ctx.arc(dot.x,dot.y,dot.r,0,Math.PI*2);
   ctx.fillStyle=`rgba(55,55,55,${dot.alpha})`;ctx.fill();
  }
 };
 draw();const observer=new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(draw,120);});
 observer.observe(canvas);return draw;
}
