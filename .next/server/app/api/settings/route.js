"use strict";(()=>{var e={};e.id=668,e.ids=[668],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},35900:e=>{e.exports=require("pg")},39491:e=>{e.exports=require("assert")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},63477:e=>{e.exports=require("querystring")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},17390:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>R,patchFetch:()=>y,requestAsyncStorage:()=>E,routeModule:()=>d,serverHooks:()=>T,staticGenerationAsyncStorage:()=>p});var a={};r.r(a),r.d(a,{GET:()=>u});var n=r(49303),i=r(88716),o=r(60670),s=r(87070),l=r(9196),c=r(75571);async function u(){if(!await (0,c.getServerSession)())return s.NextResponse.json({error:"Unauthorized"},{status:401});try{let e=await (0,l.pd)();return s.NextResponse.json(e)}catch(e){return s.NextResponse.json({error:"DB Error"},{status:500})}}let d=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/settings/route",pathname:"/api/settings",filename:"route",bundlePath:"app/api/settings/route"},resolvedPagePath:"C:\\Abdel\\Antigravity\\n8n-antigravity\\dashboard\\src\\app\\api\\settings\\route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:E,staticGenerationAsyncStorage:p,serverHooks:T}=d,R="/api/settings/route";function y(){return(0,o.patchFetch)({serverHooks:T,staticGenerationAsyncStorage:p})}},69955:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},75571:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});var a={};Object.defineProperty(t,"default",{enumerable:!0,get:function(){return i.default}});var n=r(69955);Object.keys(n).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e))&&(e in t&&t[e]===n[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return n[e]}}))});var i=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=o(void 0);if(r&&r.has(e))return r.get(e);var a={},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&Object.prototype.hasOwnProperty.call(e,i)){var s=n?Object.getOwnPropertyDescriptor(e,i):null;s&&(s.get||s.set)?Object.defineProperty(a,i,s):a[i]=e[i]}return a.default=e,r&&r.set(e,a),a}(r(45609));function o(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(o=function(e){return e?r:t})(e)}Object.keys(i).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e))&&(e in t&&t[e]===i[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}}))})},38238:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"ReflectAdapter",{enumerable:!0,get:function(){return r}});class r{static get(e,t,r){let a=Reflect.get(e,t,r);return"function"==typeof a?a.bind(e):a}static set(e,t,r,a){return Reflect.set(e,t,r,a)}static has(e,t){return Reflect.has(e,t)}static deleteProperty(e,t){return Reflect.deleteProperty(e,t)}}},75748:(e,t,r)=>{r.d(t,{Z:()=>a});let a=new(r(35900)).Pool({connectionString:process.env.DATABASE_URL,ssl:!process.env.DATABASE_URL?.includes("localhost")&&{rejectUnauthorized:!1}})},9196:(e,t,r)=>{r.d(t,{Gk:()=>l,ST:()=>i,hh:()=>o,pd:()=>c,zs:()=>s});var a=r(75748),n=r(98691);async function i(){let e=await a.Z.connect();try{console.log("Checking database schema integrity..."),await e.query(`
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
        `),await e.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);let t=await e.query("SELECT * FROM users WHERE email = $1",["admin@digitaliate.com"]);if(0===t.rows.length){console.log("Provisioning default admin user...");let t=await n.ZP.hash("admin123",10);await e.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",["Admin","admin@digitaliate.com",t])}try{await e.query("ALTER TABLE workspace_settings ADD COLUMN calendly_url TEXT DEFAULT 'https://calendly.com/contacto-digitaliate/30min';")}catch(e){}await e.query(`
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
        `),console.log("Database schema is ready.")}catch(e){throw console.error("Database initialization failed:",e.message),e}finally{e.release()}}async function o(){let e=await a.Z.connect();try{return(await e.query(`
            SELECT * FROM leads 
            ORDER BY created_at DESC 
            LIMIT 1000
        `)).rows}finally{e.release()}}async function s(e){let t=await a.Z.connect();try{let r=await t.query("SELECT * FROM leads WHERE id = $1",[e]);if(0===r.rows.length)return null;let a=await t.query("SELECT * FROM conversations WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]),n=await t.query("SELECT * FROM activities WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]);return{lead:r.rows[0],conversations:a.rows,activities:n.rows}}finally{t.release()}}async function l(){let e=await a.Z.connect();try{try{return(await e.query(`
                SELECT * FROM kanban_columns ORDER BY position ASC
            `)).rows}catch(t){if("42P01"===t.code||t.message.includes("kanban_columns"))return await i(),(await e.query(`
                    SELECT * FROM kanban_columns ORDER BY position ASC
                `)).rows;throw t}}finally{e.release()}}async function c(){let e=await a.Z.connect();try{return(await e.query("SELECT * FROM workspace_settings WHERE id = 1")).rows[0]}finally{e.release()}}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[948,972,691,609],()=>r(17390));module.exports=a})();