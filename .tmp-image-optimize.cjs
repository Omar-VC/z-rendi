const http = require("http");
const fs = require("fs");
const source = String.raw`C:\Users\User\Documents\Proyectos dev\Z-RENDI\public\images\graham-mansfield-A-XciowAyvs-unsplash.webp`;
const output = String.raw`C:\Users\User\Documents\Proyectos dev\Z-RENDI\public\images\performance-hero.webp`;
const html = `<!doctype html><meta charset="utf-8"><title>Optimizar portada</title><body style="font:16px system-ui;background:#101418;color:#eef;padding:2rem"><h1>Preparando portada optimizada…</h1><p id="status">Cargando imagen</p><script>const status=document.querySelector('#status');const img=new Image();img.onload=()=>{const maxW=2000;const scale=Math.min(1,maxW/img.naturalWidth);const c=document.createElement('canvas');c.width=Math.round(img.naturalWidth*scale);c.height=Math.round(img.naturalHeight*scale);c.getContext('2d').drawImage(img,0,0,c.width,c.height);c.toBlob(async blob=>{status.textContent='Guardando '+c.width+' × '+c.height+'…';try{const r=await fetch('/save',{method:'POST',headers:{'Content-Type':'image/webp'},body:blob});const j=await r.json();status.textContent='Listo: '+j.width+' × '+j.height+' px · '+(j.bytes/1024).toFixed(0)+' KB';}catch(e){status.textContent='Error al guardar: '+e;}},'image/webp',0.80)};img.onerror=()=>status.textContent='No se pudo cargar la imagen';img.src='/source';</script></body>`;
http.createServer((req,res)=>{
  if(req.method==='GET'&&req.url==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);return;}
  if(req.method==='GET'&&req.url==='/source'){res.writeHead(200,{'Content-Type':'image/webp'});fs.createReadStream(source).pipe(res);return;}
  if(req.method==='POST'&&req.url==='/save'){const chunks=[];req.on('data',d=>chunks.push(d));req.on('end',()=>{const data=Buffer.concat(chunks);fs.writeFileSync(output,data);res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({bytes:data.length,width:2000,height:1323}));});return;}
  res.writeHead(404);res.end();
}).listen(5173,'0.0.0.0',()=>console.log('Image optimizer listening on port 5173'));
