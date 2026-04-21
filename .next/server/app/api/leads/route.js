"use strict";(()=>{var e={};e.id=350,e.ids=[350],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:e=>{e.exports=require("pg")},6113:e=>{e.exports=require("crypto")},1377:(e,a,t)=>{t.r(a),t.d(a,{originalPathname:()=>A,patchFetch:()=>y,requestAsyncStorage:()=>T,routeModule:()=>d,serverHooks:()=>R,staticGenerationAsyncStorage:()=>u});var r={};t.r(r),t.d(r,{GET:()=>c,dynamic:()=>E});var i=t(49303),n=t(88716),s=t(60670),o=t(87070),l=t(9196);let E="force-dynamic";async function c(){try{let e=await (0,l.hh)();return o.NextResponse.json(e)}catch(e){return console.error("Fetch leads error:",e.message),o.NextResponse.json({error:"Failed to fetch leads"},{status:500})}}let d=new i.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/leads/route",pathname:"/api/leads",filename:"route",bundlePath:"app/api/leads/route"},resolvedPagePath:"C:\\Abdel\\Antigravity\\n8n-antigravity\\dashboard\\src\\app\\api\\leads\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:T,staticGenerationAsyncStorage:u,serverHooks:R}=d,A="/api/leads/route";function y(){return(0,s.patchFetch)({serverHooks:R,staticGenerationAsyncStorage:u})}},75748:(e,a,t)=>{t.d(a,{Z:()=>r});let r=new(t(35900)).Pool({connectionString:process.env.DATABASE_URL,ssl:!process.env.DATABASE_URL?.includes("localhost")&&{rejectUnauthorized:!1}})},9196:(e,a,t)=>{t.d(a,{Gk:()=>l,Rf:()=>c,ST:()=>n,hh:()=>s,pd:()=>E,zs:()=>o});var r=t(75748),i=t(98691);async function n(){let e=await r.Z.connect();try{console.log("Checking database schema integrity..."),await e.query(`
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
        `);let a=await e.query("SELECT * FROM users WHERE email = $1",["admin@digitaliate.com"]);if(0===a.rows.length){console.log("Provisioning default admin user...");let a=await i.ZP.hash("admin123",10);await e.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'superadmin')",["Admin","admin@digitaliate.com",a])}try{await e.query("ALTER TABLE leads ADD COLUMN assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL;")}catch(e){}try{await e.query("ALTER TABLE workspace_settings ADD COLUMN calendly_url TEXT DEFAULT 'https://calendly.com/contacto-digitaliate/30min';")}catch(e){}await e.query(`
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
        `),console.log("Database schema is ready.")}catch(e){throw console.error("Database initialization failed:",e.message),e}finally{e.release()}}async function s(e,a){let t=await r.Z.connect();try{let r="SELECT * FROM leads",i=[];return"agent"===a&&e&&(r+=" WHERE assigned_to = $1",i.push(e)),r+=" ORDER BY created_at DESC LIMIT 1000",(await t.query(r,i)).rows}finally{t.release()}}async function o(e,a,t){let i=await r.Z.connect();try{let r="SELECT * FROM leads WHERE id = $1",n=[e];"agent"===t&&a&&(r+=" AND assigned_to = $2",n.push(a));let s=await i.query(r,n);if(0===s.rows.length)return null;let o=await i.query("SELECT * FROM conversations WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]),l=await i.query("SELECT * FROM activities WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]);return{lead:s.rows[0],conversations:o.rows,activities:l.rows}}finally{i.release()}}async function l(){let e=await r.Z.connect();try{try{return(await e.query(`
                SELECT * FROM kanban_columns ORDER BY position ASC
            `)).rows}catch(a){if("42P01"===a.code||a.message.includes("kanban_columns"))return await n(),(await e.query(`
                    SELECT * FROM kanban_columns ORDER BY position ASC
                `)).rows;throw a}}finally{e.release()}}async function E(){let e=await r.Z.connect();try{return(await e.query("SELECT * FROM workspace_settings WHERE id = 1")).rows[0]}finally{e.release()}}async function c(){let e=await r.Z.connect();try{return(await e.query("SELECT id, name, email, role FROM users ORDER BY name ASC")).rows}finally{e.release()}}}};var a=require("../../../webpack-runtime.js");a.C(e);var t=e=>a(a.s=e),r=a.X(0,[948,972,691],()=>t(1377));module.exports=r})();