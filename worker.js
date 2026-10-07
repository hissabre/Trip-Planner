// Cloudflare Worker: keeps your Anthropic API key off the website.
// Settings > Variables: secret ANTHROPIC_API_KEY, text ALLOWED_ORIGIN (e.g. https://yourname.github.io)
export default{async fetch(req,env){
const cors={'Access-Control-Allow-Origin':env.ALLOWED_ORIGIN||'*','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
if(req.method=='OPTIONS')return new Response(null,{headers:cors});
if(req.method!='POST')return new Response('POST only',{status:405,headers:cors});
if(env.ALLOWED_ORIGIN&&req.headers.get('Origin')!==env.ALLOWED_ORIGIN)return new Response('Forbidden',{status:403,headers:cors});
const{prompt,quick}=await req.json().catch(()=>({}));
if(!prompt||prompt.length>60000)return new Response('Bad request',{status:400,headers:cors});
const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'x-api-key':env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01','content-type':'application/json'},
body:JSON.stringify({model:quick?'claude-haiku-5-5':'claude-sonnet-5-5',max_tokens:quick?1000:12000,messages:[{role:'user',content:prompt}]})});
const j=await r.json(),text=(j.content||[]).filter(c=>c.type=='text').map(c=>c.text).join('');
return new Response(JSON.stringify(r.ok?{text}:{error:(j.error&&j.error.message)||'API error'}),{status:r.ok?200:502,headers:{...cors,'Content-Type':'application/json'}})}}
