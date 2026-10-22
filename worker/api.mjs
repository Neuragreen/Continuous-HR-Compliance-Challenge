export async function handleAPI(request,store,session){
 const url=new URL(request.url),json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 if(!session?.id)return json({error:'Sign in is required.'},401);
 if(request.method!=='GET'){const origin=request.headers.get('origin');if(origin&&origin!==url.origin)return json({error:'Cross-origin writes are not allowed.'},403);}
 const saved=await store.read();
 if(request.method==='GET'&&url.pathname==='/api/workspace')return json({workspace:saved?.workspace??null,version:saved?.version??0,session});
 if(request.method==='GET'&&url.pathname==='/api/events')return json({events:saved?.events??[]});
 if(request.method!=='PUT'||url.pathname!=='/api/workspace')return json({error:'Unsupported operation.'},405);
 if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'JSON is required.'},415);
 const raw=await request.text();if(raw.length>24000000)return json({error:'Workspace exceeds 24 MB.'},413);
 let body;try{body=JSON.parse(raw)}catch{return json({error:'Invalid JSON.'},400)}
 if(body.synthetic!==true||!body.workspace||body.workspace.protectedData)return json({error:'Only generated demo workspaces may be synchronized. Imported packs must stay in the local vault.'},422);
 const batches=body.workspace.batches??[];for(const batch of Array.isArray(batches)?batches:Object.values(batches)){if(batch.source&&!['demo','generated'].includes(batch.source))return json({error:'Imported batches must stay on device.'},422);}
 if(!Number.isInteger(body.expectedVersion)||body.expectedVersion!==(saved?.version??0))return json({error:'Workspace changed in another session. Reload before saving.',version:saved?.version??0},409);
 const version=(saved?.version??0)+1,events=[...(saved?.events??[])],ids=new Set(events.map(e=>e.id));let previous=events.at(-1)?.event_hash||'GENESIS';
 for(const event of body.events??[]){if(!event.id||ids.has(event.id))continue;const recorded={...event,actor:session.name,actor_id:session.id,recorded_at:new Date().toISOString(),version,previous_hash:previous};const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(recorded)));recorded.event_hash=[...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');previous=recorded.event_hash;events.push(recorded);ids.add(event.id);}
 const next={workspace:body.workspace,version,events,updated_at:new Date().toISOString()};if(!await store.write(next,saved))return json({error:'Concurrent update. Reload before saving.'},409);return json({version});
}
