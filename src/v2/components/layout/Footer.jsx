import React, { useState } from "react";
import Icon from "../common/Icon";
import config from "../../config/config.json";
import { useTranslation } from "react-i18next";
import ThemeSelect from "./ThemeSelect";
import { BiPalette, BiGitBranch } from "react-icons/bi";

import { Link } from "react-router-dom";
import useApp from "../../context/app/useApp";
import useSettings from "../../context/settings/useSettings";

export default function Footer() {
	const { t } = useTranslation("translation", "routes");

	const [isThemeSelectOpen, setThemeSelectOpen] = useState(false);
	const { theme } = useApp();
	const { isDemo, setupComplete } = useSettings();

	return (
		<>
			<footer className="bg-base-200 border-t border-base-300">
				<div className="container mx-auto px-4 py-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
						{/* Brand Section */}
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-2">
								<Icon
									icon={config.app.icon}
									className="w-8 h-8 fill-current text-primary"
								/>
								<span className="text-xl font-bold">
									{config.app.name}
								</span>
							</div>
							<p className="text-sm text-base-content/70 max-w-xs">
								{t("footer.tagline")}
							</p>
							<div className="flex items-center gap-2 text-xs text-base-content/60">
								<span>
									{t("footer.version", {
										version: process.env.REACT_APP_VERSION,
									})}
								</span>
								<span>•</span>
								<span>
									© {new Date().getFullYear()}
									<a
										href="https://donis.dev"
										target="_blank"
										rel="noopener noreferrer"
										className="hover:text-primary transition-colors">
										{config.app.owner}
									</a>
								</span>
							</div>
						</div>

						{/* Quick Links */}
						<div className="flex flex-col gap-3">
							<h3 className="font-semibold text-sm uppercase tracking-wider text-base-content/80">
								{t("footer.quickLinks")}
							</h3>
							<ul className="flex flex-col gap-2">
								{!setupComplete && !isDemo && (
									<li>
										<Link
											to="/demo"
											className="text-sm text-base-content/70 hover:text-primary transition-colors inline-flex items-center gap-1">
											{t("demo", { ns: "routes" })}
										</Link>
									</li>
								)}
								<li>
									<Link
										to="/about"
										className="text-sm text-base-content/70 hover:text-primary transition-colors inline-flex items-center gap-1">
										{t("about", { ns: "routes" })}
									</Link>
								</li>
								<li>
									<Link
										to="/help"
										className="text-sm text-base-content/70 hover:text-primary transition-colors inline-flex items-center gap-1">
										{t("help", { ns: "routes" })}
									</Link>
								</li>
								<li>
									<Link
										to="/contact"
										className="text-sm text-base-content/70 hover:text-primary transition-colors inline-flex items-center gap-1">
										{t("contact", { ns: "routes" })}
									</Link>
								</li>
							</ul>
						</div>

						{/* Customization Section */}
						<div className="flex flex-col gap-3">
							<h3 className="font-semibold text-sm uppercase tracking-wider text-base-content/80">
								{t("footer.customize")}
							</h3>
							<div className="flex flex-col gap-2">
								<button
									className="btn btn-sm btn-outline gap-2 w-fit"
									onClick={() => setThemeSelectOpen(true)}>
									<BiPalette className="text-lg" />
									{t(`themes.${theme.active}`, {
										defaultValue: theme.active,
									})}
								</button>
								<a
									href={config.app.git}
									target="_blank"
									rel="noopener noreferrer"
									className="btn btn-sm btn-ghost gap-2 w-fit">
									<BiGitBranch className="text-lg" />
									{t("footer.viewSource")}
								</a>
							</div>
						</div>
					</div>{" "}
					{/* Bottom Bar */}
					<div className="pt-6 border-t border-base-300">
						<div className="flex flex-col md:flex-row justify-between items-center gap-4">
							<p className="text-xs text-base-content/60 text-center md:text-left">
								<a
									href="https://donis.dev"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-primary transition-colors font-medium">
									{t("footer.madeWith", {
										author: config.app.owner,
									})}
								</a>{" "}
								• {t("footer.freeOpenSource")}
							</p>
							<div className="flex items-center gap-4">
								<a
									href={config.app.git}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-base-content/60 hover:text-primary transition-colors">
									GitHub
								</a>
								<a
									href={`mailto:${config.app.contact}`}
									className="text-xs text-base-content/60 hover:text-primary transition-colors">
									{config.app.contact}
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>
			<ThemeSelect
				isOpen={isThemeSelectOpen}
				setIsOpen={setThemeSelectOpen}
			/>
		</>
	);
}
