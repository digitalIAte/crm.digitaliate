export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-gray-900 font-sans selection:bg-digitaliate selection:text-white relative overflow-hidden">

            {/* Big background logo */}
            <img
                src="/images/logo_digitaliate.png"
                alt=""
                className="absolute inset-0 w-full h-full object-contain opacity-15 pointer-events-none select-none"
                aria-hidden="true"
            />

            {/* Ambient primary glow behind form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-digitaliate/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Login Form */}
            <div className="max-w-md w-full space-y-8 relative z-10 bg-white/70 backdrop-blur-xl p-10 rounded-2xl border border-white shadow-2xl mx-4">

                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 mb-4 shadow-lg border border-gray-100">
                        <img src="/images/logo_digitaliate.png" alt="Digitaliate CRM" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Iniciar Sesión</h2>
                        <p className="text-gray-500 mt-2 text-sm">Ingresa tus credenciales para acceder al CRM.</p>
                    </div>
                </div>

                <form className="mt-8 space-y-6" action="/crm/leads">
                    <input type="hidden" name="remember" defaultValue="true" />

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico</label>
                            <input id="email-address" name="email" type="email" required className="appearance-none block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-digitaliate focus:border-transparent transition-all duration-200 sm:text-sm shadow-sm" placeholder="tu@email.com" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                            <input id="password" name="password" type="password" required className="appearance-none block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-digitaliate focus:border-transparent transition-all duration-200 sm:text-sm shadow-sm" placeholder="••••••••" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-digitaliate focus:ring-digitaliate border-gray-300 rounded bg-white accent-digitaliate" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                                Recordarme
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-digitaliate hover:text-blue-700 transition-colors">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-digitaliate hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-digitaliate focus:ring-offset-white transition-all duration-200 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5">
                            Entrar al CRM
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
