// Fine stochastic grain follows two broad waves. A clear centre and low
// contrast keep the texture behind the text; the seed stays fixed per visit.
export function meshPixels(width,height,seed=19){
 const pixels=new Uint8ClampedArray(width*height*4);let state=seed>>>0;
 const random=()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
 const phase=(seed%1000)/1000*.28,columns=[];
 for(let x=0;x<width;x++){
  const u=x/width;
  columns.push({a:.01+.34*u+.13*Math.sin(u*5.2+phase),b:.93-.19*Math.sin(u*4.5+phase)-.08*u,quietX:Math.pow((u-.5)/.36,4)});
 }
 for(let y=0;y<height;y++){
  const v=y/height,quietY=Math.pow((v-.51)/.29,4);
  for(let x=0;x<width;x++){
   const column=columns[x],a=(v-column.a)/.13,b=(v-column.b)/.16;
   const waveA=Math.exp(-a*a*1.65),waveB=Math.exp(-b*b*1.8);
   const clearCentre=1-.95*Math.exp(-column.quietX-quietY);
   const density=(waveA*.25+waveB*.21)*clearCentre;
   if(random()>=density)continue;
   const i=(y*width+x)*4,grey=118+Math.floor(random()*35);
   pixels[i]=grey;pixels[i+1]=grey;pixels[i+2]=grey;
   pixels[i+3]=Math.round((.14+random()*.22)*255*clearCentre);
  }
 }
 return pixels;
}
export function mountMesh(canvas){
 const seed=crypto.getRandomValues(new Uint32Array(1))[0];let timer;
 const draw=()=>{
  const box=canvas.getBoundingClientRect(),scale=Math.min(1.25,1600/box.width);
  const w=Math.max(1,Math.round(box.width*scale)),h=Math.max(1,Math.round(box.height*scale));
  canvas.width=w;canvas.height=h;
  canvas.getContext('2d').putImageData(new ImageData(meshPixels(w,h,seed),w,h),0,0);
 };
 draw();const observer=new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(draw,120);});
 observer.observe(canvas);return draw;
}
