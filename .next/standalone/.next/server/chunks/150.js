exports.id=150,exports.ids=[150],exports.modules={90675:(e,t,a)=>{Promise.resolve().then(a.t.bind(a,12994,23)),Promise.resolve().then(a.t.bind(a,96114,23)),Promise.resolve().then(a.t.bind(a,9727,23)),Promise.resolve().then(a.t.bind(a,79671,23)),Promise.resolve().then(a.t.bind(a,41868,23)),Promise.resolve().then(a.t.bind(a,84759,23))},57670:(e,t,a)=>{Promise.resolve().then(a.bind(a,82206))},16702:()=>{},82206:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>A});var r=a(10326),i=a(35047),s=a(90434),n=a(24319),l=a(37358),o=a(24061),d=a(76464),c=a(19169),m=a(88378),u=a(79635),E=a(71810),h=a(17577),g=a(77109);function T(){let e=(0,i.usePathname)(),{data:t}=(0,g.useSession)(),[a,T]=(0,h.useState)(0),[x,A]=(0,h.useState)("DIGITALIATE CRM"),y=[{name:"Dashboard",href:"/crm",icon:n.Z},{name:"Calendario",href:"/crm/calendar",icon:l.Z},{name:"Leads Pipeline",href:"/crm/leads",icon:o.Z,badge:a},{name:"Analytics",href:"/crm/analytics",icon:d.Z},{name:"Plantillas",href:"/crm/templates",icon:c.Z},{name:"Settings",href:"/crm/settings",icon:m.Z}];return(0,r.jsxs)("aside",{className:"w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10",children:[r.jsx("div",{className:"h-16 flex items-center px-6 border-b border-gray-50",children:r.jsx(s.default,{href:"/crm",className:"text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-digitaliate to-digitaliate-dark truncate",children:x})}),r.jsx("nav",{className:"flex-1 px-4 py-6 space-y-1",children:y.map(t=>{let a=e===t.href||e.startsWith(t.href)&&"/crm"!==t.href;return(0,r.jsxs)(s.default,{href:t.href,className:`
                                group flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150
                                ${a?"bg-digitaliate/10 text-digitaliate":"text-gray-500 hover:bg-gray-50 hover:text-gray-900"}
                            `,children:[r.jsx(t.icon,{className:`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-150
                                    ${a?"text-digitaliate":"text-gray-400 group-hover:text-gray-500"}
                                `,"aria-hidden":"true"}),t.name,t.badge?r.jsx("span",{className:"ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse",children:t.badge}):null]},t.name)})}),(0,r.jsxs)("div",{className:"p-4 border-t border-gray-50 space-y-4",children:[t?.user&&(0,r.jsxs)("div",{className:"flex items-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-100",children:[r.jsx("div",{className:"w-8 h-8 rounded-full bg-digitaliate/20 text-digitaliate flex items-center justify-center mr-3 shadow-inner",children:r.jsx(u.Z,{className:"h-4 w-4"})}),(0,r.jsxs)("div",{className:"flex-1 min-w-0",children:[r.jsx("p",{className:"text-xs font-bold text-gray-900 truncate",children:t.user.name||"Usuario"}),r.jsx("p",{className:"text-[10px] text-gray-500 truncate",children:t.user.email})]})]}),(0,r.jsxs)("button",{onClick:()=>(0,g.signOut)(),className:"w-full flex items-center px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors",children:[r.jsx(E.Z,{className:"mr-3 h-5 w-5"}),"Cerrar Sesi\xf3n"]}),(0,r.jsxs)("div",{className:"bg-gradient-to-br from-digitaliate/5 to-digitaliate-dark/5 rounded-xl p-4 text-center border border-digitaliate/10",children:[r.jsx("p",{className:"text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-tight",children:"Direct Access Mode"}),r.jsx("div",{className:"font-bold text-gray-700 text-xs truncate",children:"Abdel Otsmani"})]})]})]})}function x({children:e}){return r.jsx(g.SessionProvider,{children:e})}function A({children:e}){return"/crm/login"===(0,i.usePathname)()?r.jsx("div",{className:"min-h-screen bg-[#0a0a0a]",children:e}):r.jsx(x,{children:(0,r.jsxs)("div",{className:"flex h-screen bg-[#F8FAFC]",children:[r.jsx(T,{}),(0,r.jsxs)("main",{className:"flex-1 overflow-y-auto relative",children:[r.jsx("div",{className:"absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-digitaliate/10 to-transparent -z-10 pointer-events-none"}),r.jsx("div",{className:"p-10 pt-12 min-h-full",children:e})]})]})})}},92072:(e,t,a)=>{"use strict";a.r(t),a.d(t,{$$typeof:()=>n,__esModule:()=>s,default:()=>l});var r=a(68570);let i=(0,r.createProxy)(String.raw`C:\Abdel\Antigravity\n8n-antigravity\dashboard\src\app\crm\layout.tsx`),{__esModule:s,$$typeof:n}=i;i.default;let l=(0,r.createProxy)(String.raw`C:\Abdel\Antigravity\n8n-antigravity\dashboard\src\app\crm\layout.tsx#default`)},32029:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>s,metadata:()=>i});var r=a(19510);a(5023);let i={title:"CRM Dashboard",description:"Internal CRM Dashboard running on n8n webhooks"};function s({children:e}){return r.jsx("html",{lang:"es",children:r.jsx("body",{children:e})})}},71854:(e,t,a)=>{"use strict";a.d(t,{default:()=>r});let r=new(a(35900)).Pool({connectionString:process.env.DATABASE_URL,ssl:!process.env.DATABASE_URL?.includes("localhost")&&{rejectUnauthorized:!1}})},75748:(e,t,a)=>{"use strict";a.d(t,{Z:()=>r});let r=new(a(35900)).Pool({connectionString:process.env.DATABASE_URL,ssl:!process.env.DATABASE_URL?.includes("localhost")&&{rejectUnauthorized:!1}})},9196:(e,t,a)=>{"use strict";a.d(t,{Gk:()=>o,ST:()=>s,hh:()=>n,pd:()=>d,zs:()=>l});var r=a(75748),i=a(98691);async function s(){let e=await r.Z.connect();try{console.log("Checking database schema integrity..."),await e.query(`
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
        `);let t=await e.query("SELECT * FROM users WHERE email = $1",["admin@digitaliate.com"]);if(0===t.rows.length){console.log("Provisioning default admin user...");let t=await i.ZP.hash("admin123",10);await e.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",["Admin","admin@digitaliate.com",t])}try{await e.query("ALTER TABLE workspace_settings ADD COLUMN calendly_url TEXT DEFAULT 'https://calendly.com/contacto-digitaliate/30min';")}catch(e){}await e.query(`
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
        `),console.log("Database schema is ready.")}catch(e){throw console.error("Database initialization failed:",e.message),e}finally{e.release()}}async function n(){let e=await r.Z.connect();try{return(await e.query(`
            SELECT * FROM leads 
            ORDER BY created_at DESC 
            LIMIT 1000
        `)).rows}finally{e.release()}}async function l(e){let t=await r.Z.connect();try{let a=await t.query("SELECT * FROM leads WHERE id = $1",[e]);if(0===a.rows.length)return null;let r=await t.query("SELECT * FROM conversations WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]),i=await t.query("SELECT * FROM activities WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 50",[e]);return{lead:a.rows[0],conversations:r.rows,activities:i.rows}}finally{t.release()}}async function o(){let e=await r.Z.connect();try{try{return(await e.query(`
                SELECT * FROM kanban_columns ORDER BY position ASC
            `)).rows}catch(t){if("42P01"===t.code||t.message.includes("kanban_columns"))return await s(),(await e.query(`
                    SELECT * FROM kanban_columns ORDER BY position ASC
                `)).rows;throw t}}finally{e.release()}}async function d(){let e=await r.Z.connect();try{return(await e.query("SELECT * FROM workspace_settings WHERE id = 1")).rows[0]}finally{e.release()}}},5023:()=>{}};