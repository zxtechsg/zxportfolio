// Randomly scattered, soft round grains follow a continuously folded surface.
// A visit keeps the same grains; navigation changes the cloth, not the noise seed.
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
export function clothField(u,v,phase=0){
 const bend=.12*Math.sin(u*5.7+phase*.36)+.055*Math.sin(u*11-phase*.24);
 const top=.16+u*.12+bend;
 const bottom=.84-u*.10+.13*Math.sin(u*5-1.5-phase*.31);
 const a=v-top,b=v-bottom;
 const envelopeA=Math.exp(-Math.pow(a/.19,2));
 const envelopeB=Math.exp(-Math.pow(b/.23,2));
 const foldA=Math.pow(.5+.5*Math.cos(a*59+u*2.2),2.5);
 const foldB=Math.pow(.5+.5*Math.cos(b*48-u*3.5),2.8);
 const centre=Math.exp(-Math.pow((u-.50)/.31,4)-Math.pow((v-.53)/.28,4));
 const title=Math.exp(-Math.pow((u-.26)/.28,4)-Math.pow((v-.18)/.10,4));
 const quiet=(1-.90*centre)*(1-.65*title);
 return clamp((envelopeA*(.08+.82*foldA)+envelopeB*(.07+.77*foldB))*quiet);
}
export function createGrains(width,height,seed=19){
 const points=new Float32Array(Math.ceil(width*height*.64)*4);let state=seed>>>0;
 const random=()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
 for(let i=0;i<points.length;i+=4){points[i]=random()*width;points[i+1]=random()*height;points[i+2]=.42+random()*.62;points[i+3]=.35+random()*.65;}
 return points;
}
function paintGrains(width,height,points,phase){
 const pixels=new Uint8ClampedArray(width*height*4),cols=112,rows=88,field=new Float32Array((cols+1)*(rows+1));
 for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++)field[y*(cols+1)+x]=phase===null?1:clothField(x/cols,y/rows,phase);
 const driftX=Math.sin(phase*.42)*width*.026,driftY=Math.sin(phase*.31)*height*.018;
 for(let i=0;i<points.length;i+=4){
  const x=(points[i]+driftX+width)%width,y=(points[i+1]+driftY+height)%height;
  const gx=x/width*cols,gy=y/height*rows,ix=Math.floor(gx),iy=Math.floor(gy),tx=gx-ix,ty=gy-iy,k=iy*(cols+1)+ix;
  const density=(field[k]*(1-tx)+field[k+1]*tx)*(1-ty)+(field[k+cols+1]*(1-tx)+field[k+cols+2]*tx)*ty;
  if(density<.005)continue;
  const radius=points[i+2],alpha=density*(.52+points[i+3]*.42),left=Math.floor(x),top=Math.floor(y);
  for(let sy=top;sy<=top+1;sy++)for(let sx=left;sx<=left+1;sx++){
   if(sx<0||sy<0||sx>=width||sy>=height)continue;
   const dx=sx+.5-x,dy=sy+.5-y,coverage=clamp((radius*radius-dx*dx-dy*dy)*1.4);
   if(!coverage)continue;
   const at=(sy*width+sx)*4,a=coverage*alpha;
   pixels[at]=pixels[at+1]=pixels[at+2]=42;
   pixels[at+3]=Math.min(184,pixels[at+3]+(255-pixels[at+3])*a);
  }
 }
 return pixels;
}
export function meshPixels(width,height,seed=19,phase=0){return paintGrains(width,height,createGrains(width,height,seed),phase);}
// The GPU only bends a stable grain texture. No new random samples per frame.
const vertexSource=`attribute vec2 a_position;
varying vec2 v_uv;
void main(){v_uv=vec2((a_position.x+1.0)*.5,(1.0-a_position.y)*.5);gl_Position=vec4(a_position,0.0,1.0);}`;
const fragmentSource=`precision highp float;
varying vec2 v_uv;
uniform sampler2D u_grain;
uniform float u_phase;
float sq(float x){return x*x;}
float fourth(float x){return sq(sq(x));}
void main(){
 float u=v_uv.x,v=v_uv.y,p=u_phase;
 float bend=.12*sin(u*5.7+p*.36)+.055*sin(u*11.0-p*.24);
 float a=v-(.16+u*.12+bend);
 float b=v-(.84-u*.10+.13*sin(u*5.0-1.5-p*.31));
 float foldA=pow(max(0.0,.5+.5*cos(a*59.0+u*2.2)),2.5);
 float foldB=pow(max(0.0,.5+.5*cos(b*48.0-u*3.5)),2.8);
 float centre=exp(-fourth((u-.50)/.31)-fourth((v-.53)/.28));
 float title=exp(-fourth((u-.26)/.28)-fourth((v-.18)/.10));
 float density=clamp((exp(-sq(a/.19))*(.08+.82*foldA)+exp(-sq(b/.23))*(.07+.77*foldB))*(1.0-.90*centre)*(1.0-.65*title),0.0,1.0);
 vec2 drift=vec2(sin(p*.42)*.026,sin(p*.31)*.018);
 float grain=texture2D(u_grain,fract(v_uv-drift)).a;
 gl_FragColor=vec4(vec3(42.0/255.0),min(.72,grain*density));
}`;
function gpuRenderer(canvas){
 const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,depth:false,powerPreference:'low-power'});
 if(!gl)return null;
 const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}return shader;};
 const vertex=compile(gl.VERTEX_SHADER,vertexSource),fragment=compile(gl.FRAGMENT_SHADER,fragmentSource);
 if(!vertex||!fragment)return null;
 const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))return null;
 gl.deleteShader(vertex);gl.deleteShader(fragment);gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 const position=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
 const texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.uniform1i(gl.getUniformLocation(program,'u_grain'),0);const phaseLocation=gl.getUniformLocation(program,'u_phase');
 return {
  upload(width,height,pixels){gl.viewport(0,0,canvas.width,canvas.height);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,pixels);},
  draw(phase){gl.uniform1f(phaseLocation,phase);gl.drawArrays(gl.TRIANGLES,0,3);}
 };
}
export function mountMesh(canvas){
 let gpu=gpuRenderer(canvas),context;
 if(!gpu){const replacement=canvas.cloneNode();canvas.replaceWith(replacement);canvas=replacement;context=canvas.getContext('2d');}
 if(!gpu&&!context)return {navigate(){}};
 const seed=crypto.getRandomValues(new Uint32Array(1))[0],reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let width=1,height=1,grains,phase=0,from=0,to=0,start=0,frame=0,timer,route=null;
 const draw=()=>{if(gpu)gpu.draw(phase);else context.putImageData(new ImageData(paintGrains(width,height,grains,phase),width,height),0,0);};
 const tick=time=>{
  frame=0;
  if(document.hidden){phase=to;draw();return;}
  const progress=clamp((time-start)/1450),ease=progress*progress*(3-2*progress);
  phase=from+(to-from)*ease;draw();
  if(progress<1)frame=requestAnimationFrame(tick);
 };
 const resize=()=>{
  const box=canvas.getBoundingClientRect(),scale=Math.min(1.1,1000/Math.max(box.width,box.height));
  width=Math.max(1,Math.round(box.width*scale));height=Math.max(1,Math.round(box.height*scale));
  canvas.width=width;canvas.height=height;grains=createGrains(width,height,seed);
  if(gpu)gpu.upload(width,height,paintGrains(width,height,grains,null));draw();
 };
 const navigate=id=>{
  if(id===route)return;
  let hash=0;for(const char of id)hash=(Math.imul(hash,31)+char.charCodeAt(0))>>>0;
  const next=(hash%127)/17;
  if(route===null||reduced.matches||!gpu){cancelAnimationFrame(frame);frame=0;phase=to=next;draw();}
  else{cancelAnimationFrame(frame);from=phase;to=next;start=performance.now();frame=requestAnimationFrame(tick);}
  route=id;
 };
 reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);frame=0;phase=to;draw();}});
 const observer=new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(resize,120);});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);frame=0;});
 canvas.addEventListener('webglcontextrestored',()=>{gpu=gpuRenderer(canvas);if(gpu){phase=to;resize();}});
 resize();observer.observe(canvas);return {navigate};
}
