import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	BiBarChartAlt2,
	BiCalculator,
	BiChart,
	BiCloudUpload,
	BiInfoCircle,
	BiPackage,
	BiShieldQuarter,
	BiTrendingUp,
	BiWorld,
} from "react-icons/bi";
import { Link } from "react-router-dom";

import LangSelect from "../../components/layout/LangSelect";
import useApp from "../../context/app/useApp";
import useConfig from "../../hooks/app/useConfig";

export default function Welcome() {
	const { t } = useTranslation("pages/welcome");
	const [langSelectOpen, setLangSelectOpen] = useState(false);

	const config = useConfig();
	const appname = config.get("app.name");

	// language type is like this: {all: Array(2), code: 'tr', countryCode: 'tr', name: 'Turkish', change: ƒ, …}
	const { language } = useApp();

	const features = [
		{
			icon: <BiCalculator className="text-4xl" />,
			title: t("features.costAnalysis.title"),
			description: t("features.costAnalysis.description"),
		},
		{
			icon: <BiShieldQuarter className="text-4xl" />,
			title: t("features.securePrivate.title"),
			description: t("features.securePrivate.description"),
		},
		{
			icon: <BiTrendingUp className="text-4xl" />,
			title: t("features.growthInsights.title"),
			description: t("features.growthInsights.description"),
		},
		{
			icon: <BiChart className="text-4xl" />,
			title: t("features.visualReports.title"),
			description: t("features.visualReports.description"),
		},
		{
			icon: <BiPackage className="text-4xl" />,
			title: t("features.productManagement.title"),
			description: t("features.productManagement.description"),
		},
		{
			icon: <BiBarChartAlt2 className="text-4xl" />,
			title: t("features.realtimeCalculations.title"),
			description: t("features.realtimeCalculations.description"),
		},
	];

	return (
		<main className="min-h-[100dvh]">
			{/* Hero Section */}
			<div
				className="relative min-h-[650px] flex items-center bg-cover bg-center"
				style={{
					backgroundImage: `url(${process.env.PUBLIC_URL}/img/welcome-v2-1280.jpg)`,
				}}>
				<div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-secondary/70"></div>
				{/* Language Selector - Top Right */}
				<div className="absolute top-4 right-4 z-10">
					<button
						onClick={() => setLangSelectOpen(true)}
						className="btn btn-sm bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white gap-2"
						aria-label="Select Language">
						<BiWorld className="text-xl" />
						{language && (
							<>
								<span className="text-xs uppercase font-semibold">
									{language.code}
								</span>
							</>
						)}
					</button>
				</div>
				<div className="relative container mx-auto px-4 py-20">
					<div className="max-w-4xl mx-auto text-center text-white">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
							<span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
							<span className="text-sm font-medium">
								{t("badge")}
							</span>
						</div>

						{/* Main Heading */}
						<h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
							{t("title", { appname })}
						</h1>

						<p className="mb-10 text-xl md:text-2xl font-light opacity-95 max-w-3xl mx-auto">
							{t("lead")}
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-wrap gap-4 justify-center items-center mb-8">
							<Link
								to="/settings"
								className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none shadow-xl transform transition hover:scale-105">
								<BiCalculator className="text-2xl" />
								{t("buttons.start")}
							</Link>

							<Link
								to="/demo"
								className="btn btn-lg btn-outline border-2 border-white text-white hover:bg-white hover:text-primary hover:border-white shadow-lg transform transition hover:scale-105">
								{t("buttons.demo")}
							</Link>
						</div>

						{/* Load Backup */}
						<div className="mt-8">
							<Link
								to="/system"
								className="btn btn-ghost text-white border border-white/30 hover:bg-white/10 gap-2">
								<BiCloudUpload className="text-xl" />
								{t("buttons.load")}
							</Link>
						</div>
					</div>
				</div>
				{/* Scroll indicator */}
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
					<div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
						<div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="bg-base-100 py-20">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-4">
							{t("features.sectionTitle")}
						</h2>
						<p className="text-lg text-base-content/70 max-w-2xl mx-auto">
							{t("features.sectionSubtitle")}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{features.map((feature, index) => (
							<div
								key={index}
								className="card bg-base-200/50 hover:bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
								<div className="card-body items-center text-center">
									<div className="text-primary mb-4">
										{feature.icon}
									</div>
									<h3 className="card-title text-xl mb-2">
										{feature.title}
									</h3>
									<p className="text-base-content/70">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="bg-gradient-to-r from-primary to-secondary py-16">
				<div className="container mx-auto px-4 text-center text-white">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						{t("cta.title")}
					</h2>
					<p className="text-lg mb-8 opacity-90">
						{t("cta.subtitle")}
					</p>
					<div className="flex gap-4 justify-center flex-wrap">
						<Link
							to="/settings"
							className="btn btn-lg bg-white text-primary hover:bg-white/90 border-none shadow-xl">
							{t("buttons.beginJourney")}
						</Link>
						<Link
							to="/about"
							className="btn btn-lg btn-ghost text-white border-white/30 hover:bg-white/10 gap-2">
							{t("moreInfo")}
							<BiInfoCircle />
						</Link>
					</div>
				</div>
			</div>

			{/* Language Select Modal */}
			<LangSelect isOpen={langSelectOpen} setIsOpen={setLangSelectOpen} />
		</main>
	);
}
