"use strict";(()=>{var e={};e.id=252,e.ids=[252],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:e=>{e.exports=require("pg")},6113:e=>{e.exports=require("crypto")},58777:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>L,patchFetch:()=>w,requestAsyncStorage:()=>A,routeModule:()=>T,serverHooks:()=>p,staticGenerationAsyncStorage:()=>y});var r={};a.r(r),a.d(r,{DELETE:()=>R,GET:()=>c,PATCH:()=>u,dynamic:()=>E});var s=a(49303),n=a(88716),i=a(60670),o=a(87070),l=a(9196),d=a(75748);let E="force-dynamic";async function c(e,{params:t}){let{id:a}=t;if(!a)return o.NextResponse.json({error:"Lead ID is required"},{status:400});try{let e=await (0,l.zs)(a);if(!e)return o.NextResponse.json({error:"Lead not found"},{status:404});return o.NextResponse.json(e)}catch(e){return console.error("Fetch lead details error:",e.message),o.NextResponse.json({error:"Failed to fetch lead details"},{status:500})}}async function u(e,{params:t}){let{id:a}=t,r=await e.json();if(!a)return o.NextResponse.json({error:"Lead ID is required"},{status:400});try{let e=await d.Z.connect();try{let t=Object.keys(r);if(0===t.length)return o.NextResponse.json({error:"No fields to update"},{status:400});let s=t.map((e,t)=>`${e} = $${t+1}`).join(", "),n=t.map(e=>r[e]);return await e.query(`UPDATE leads SET ${s} WHERE id = $${t.length+1}`,[...n,a]),o.NextResponse.json({success:!0})}finally{e.release()}}catch(e){return console.error("Update lead DB error:",e.message),o.NextResponse.json({error:"Failed to update lead"},{status:500})}}async function R(e,{params:t}){let{id:a}=t;if(!a)return o.NextResponse.json({error:"Lead ID is required"},{status:400});try{let e=await d.Z.connect();try{await e.query("BEGIN"),await e.query("DELETE FROM activities WHERE lead_id = $1",[a]),await e.query("DELETE FROM conversations WHERE lead_id = $1",[a]),await e.query("DELETE FROM reminders WHERE lead_id = $1",[a]);let t=await e.query("DELETE FROM leads WHERE id = $1 RETURNING id",[a]);if(await e.query("COMMIT"),0===t.rowCount)return o.NextResponse.json({error:"Lead not found"},{status:404});return o.NextResponse.json({success:!0,deletedId:a})}catch(t){throw await e.query("ROLLBACK"),t}finally{e.release()}}catch(e){return console.error("Delete lead DB error:",e.message),o.NextResponse.json({error:"Failed to delete lead"},{status:500})}}let T=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/leads/[id]/route",pathname:"/api/leads/[id]",filename:"route",bundlePath:"app/api/leads/[id]/route"},resolvedPagePath:"C:\\Abdel\\Antigravity\\n8n-antigravity\\dashboard\\src\\app\\api\\leads\\[id]\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:A,staticGenerationAsyncStorage:y,serverHooks:p}=T,L="/api/leads/[id]/route";function w(){return(0,i.patchFetch)({serverHooks:p,staticGenerationAsyncStorage:y})}},75748:(e,t,a)=>{a.d(t,{Z:()=>r});let r=new(a(35900)).Pool({connectionString:process.env.DATABASE_URL,ssl:!process.env.DATABASE_URL?.includes("localhost")&&{rejectUnauthorized:!1}})},9196:(e,t,a)=>{a.d(t,{Gk:()=>l,Rf:()=>E,ST:()=>n,hh:()=>i,pd:()=>d,zs:()=>o});var r=a(75748),s=a(98691);async function n(){let e=await r.Z.connect();try{console.log("Checking database schema integrity..."),await e.query(`
            CREATE TABLE IF NOT EXISTS kanban_columns (
                id VARCHAR(50) PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                color VARCHAR(100) DEFAULT 'border-gray-200 bg-gray-50/50',
                position INT DEFAULT 0
            );
            
            INSERT INTO kanban_columns (id, title, color, position) VALUES
            ('new', 'Nuevos', 'border-blue-200 bg-blue-50/50', 0),
            ('contacted', 'Contactados', 'border-yellow-200 bg-yellow-50/50', 1),
            ('qualified', 'Cualificados', 'border-emerald-200 bg-emerald-50/50', 2),
            ('lost', 'Perdidos', 'border-red-200 bg-red-50/50', 3)
            ON CONFLICT (id) DO NOTHING;
        `);try{await e.query("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'agent';")}catch(e){}await e.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'agent',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);let t=await e.query("SELECT * FROM users WHERE email = $1",["admin@digitaliate.com"]);if(0===t.rows.length){console.log("Provisioning default admin user...");let t=await s.ZP.hash("admin123",10);await e.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'superadmin')",["Admin","admin@digitaliate.com",t])}try{await e.query("ALTER TABLE leads ADD COLUMN assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL;")}catch(e){}try{await e.query("ALTER TABLE workspace_settings ADD COLUMN calendly_url TEXT DEFAULT 'https://calendly.com/contacto-digitaliate/30min';")}catch(e){}await e.query(`
            CREATE TABLE IF NOT EXISTS workspace_settings (
                id SERIAL PRIMARY KEY,
                agency_name VARCHAR(255) DEFAULT 'Digitaliate CRM',
                primary_color VARCHAR(50) DEFAULT '#2563EB',
                n8n_webhook_url TEXT,
                calendly_url TEXT DEFAULT 'https://calendly.com/contacto-digitaliate/30min',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            INSERT INTO workspace_settings (id, agency_name, calendly_url) 
            VALUES (1, 'Digitaliate CRM', 'https://calendly.com/contacto-digitaliate/30min')
            ON CONFLICT (id) DO NOTHING;
        `),await e.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
                title VARCHAR(255),
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP NOT NULL,
                status VARCHAR(50) DEFAULT 'scheduled',
                meeting_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `),console.log("Database schema is ready.")}catch(e){throw console.error("Database initialization failed:",e.message),e}finally{e.release()}}async function i(e,t){let a=await r.Z.connect();try{let r="SELECT * FROM leads",s=[];return"agent"===t&&e&&(r+=" WHERE assigned_to = $1",s.push(e)),r+=" ORDER BY created_at DESC LIMIT 1000",(await a.query(r,s)).rows}finally{a.release()}}async function o(e,t,a){let s=await r.Z.connect();try{let r="SELECT * FROM leads WHERE id = $1",n=[e];"agent"===a&&t&&(r+=" AND assigned_to = $2",n.push(t));let i=await s.query(r,n);if(0===i.rows.length)return null;let o=await s.query("SELECT * FROM conversations WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]),l=await s.query("SELECT * FROM activities WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]);return{lead:i.rows[0],conversations:o.rows,activities:l.rows}}finally{s.release()}}async function l(){let e=await r.Z.connect();try{try{return(await e.query(`
                SELECT * FROM kanban_columns ORDER BY position ASC
            `)).rows}catch(t){if("42P01"===t.code||t.message.includes("kanban_columns"))return await n(),(await e.query(`
                    SELECT * FROM kanban_columns ORDER BY position ASC
                `)).rows;throw t}}finally{e.release()}}async function d(){let e=await r.Z.connect();try{return(await e.query("SELECT * FROM workspace_settings WHERE id = 1")).rows[0]}finally{e.release()}}async function E(){let e=await r.Z.connect();try{return(await e.query("SELECT id, name, email, role FROM users ORDER BY name ASC")).rows}finally{e.release()}}}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[948,972,691],()=>a(58777));module.exports=r})();