import React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import fondoLogin from "../../assets/Images/fondoLogin.png";
import fondo from "../../assets/Images/fondo.png";
import logoCompleto from "../../assets/Images/logoCompleto.png";

export default function Login({ onLogin }) {
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		onLogin();
	};

	return (
		<main className="flex min-h-screen w-full items-center justify-end bg-white p-6 font-sans md:pr-[12vw]" 
        style={{ backgroundImage: `url(${fondoLogin})`, backgroundSize: "100% 167%", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>
			<section className="box-border w-full max-w-[500px] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(217,97,40,0.24)] sm:p-10" aria-labelledby="login-title">
				<img alt="Enecon, siempre conectado" className="mx-auto  block h-[200px] w-[200px] object-contain" src={logoCompleto} />
				<p className="mb-[20px] text-[15px] leading-relaxed text-center text-orange-900">Inicia sesión para continuar en AppSig.</p>

				<form onSubmit={handleSubmit}>
					<div className="mb-5">
						<label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Correo electrónico</label>
						<input
							id="email"
							name="email"
							type="email"
							autoComplete="username"
							placeholder="usuario@enecon.net.co"
							required
							className="box-border w-full rounded-[10px] border border-slate-300 bg-white px-[14px] py-[13px] text-[15px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
						/>
					</div>
					<div className="mb-5">
						<label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Contraseña</label>
						<div className="relative">
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								placeholder="Ingresa tu contraseña"
								required
								className="box-border w-full rounded-[10px] border border-slate-300 bg-white px-[14px] py-[13px] pr-12 text-[15px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
							/>
							<button
								aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
								aria-pressed={showPassword}
								className="absolute inset-y-0 right-0 flex w-12 items-center justify-center border-0 bg-transparent text-slate-500 hover:text-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
								onClick={() => setShowPassword((visible) => !visible)}
								type="button"
							>
								{showPassword ? <EyeOff aria-hidden="true" size={20} /> : <Eye aria-hidden="true" size={20} />}
							</button>
						</div>
					</div>
					<button
                     type="submit" 
					className="mt-1 w-full cursor-pointer rounded-[10px] border-0 bg-gradient-to-r from-[#c20016] to-[#d06519] p-[14px] text-[15px] font-bold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5   hover:shadow-[0_10px_24px_rgba(194,0,22,0.28)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:translate-y-0 active:scale-[0.99] motion-reduce:transition-none">Ingresar
                    </button>
				</form>
			</section>
		</main>
	);
}

