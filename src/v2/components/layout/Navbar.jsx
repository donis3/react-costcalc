import React, { useEffect, useState, useRef } from "react";
import { FaBars } from "react-icons/fa";
import { ReactComponent as Logo } from "../../img/costotus-v2.svg";
import "./Navbar.css";

import LangSelect from "./LangSelect";

import ReactCountryFlag from "react-country-flag";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useClickOutside from "../../hooks/common/useClickOutside";
import Icon from "../common/Icon";
import useApp from "../../context/app/useApp";
import useConfig from "../../hooks/app/useConfig";
import useSettings from "../../context/settings/useSettings";

export default function Navbar() {
	const { t } = useTranslation("routes", "translation");
	const [menuOpen, setMenuOpen] = useState(false);
	const [isLangModalOpen, setLangModalOpen] = useState(false);
	const { language } = useApp();
	const { setupComplete } = useSettings();

	const loc = useLocation();

	const navbarRef = useRef();
	useClickOutside(navbarRef, () => setMenuOpen(false));

	//Close menu when location changes
	useEffect(() => {
		setMenuOpen(false);
	}, [loc.pathname]);

	return (
		<>
			<nav
				ref={navbarRef}
				className={`sticky top-0 z-50 px-4 xl:px-6 py-4 bg-neutral shadow-lg`}>
				<div className="container mx-auto flex flex-wrap items-center justify-between">
					<div className="w-full flex justify-between xl:w-auto">
						<Link to="/" className="text-neutral-content ">
							<Logo width="200" />
						</Link>
						<button
							className="navbar-collapse-btn"
							type="button"
							onClick={() => setMenuOpen(!menuOpen)}>
							<FaBars />
						</button>
					</div>
					<div
						className={
							"nav-list-container xl:w-3/5 " +
							(menuOpen ? "flex" : " hidden")
						}>
						<ul className="nav-list  flex flex-wrap">
							{setupComplete && (
								<>
									{/* Business Links */}
									<NavbarItem
										to="/endproducts"
										module="endproducts">
										{t("endproducts")}
									</NavbarItem>
									<NavbarItem
										to="/materials"
										module="materials">
										{t("materials")}
									</NavbarItem>
									<NavbarItem
										to="/packages"
										module="packages">
										{t("packages")}
									</NavbarItem>
									<NavbarDropdown
										text={t("nav.manufacturing", {
											ns: "translation",
										})}
										module="manufacturing">
										<NavbarItem
											to="/products"
											module="products">
											{t("nav.products", {
												ns: "translation",
											})}
										</NavbarItem>
										<NavbarItem
											to="/recipes"
											module="recipes">
											{t("nav.recipes", {
												ns: "translation",
											})}
										</NavbarItem>
									</NavbarDropdown>

									{/* Company Nested */}
									<NavbarDropdown
										text={t("nav.company", {
											ns: "translation",
										})}
										module="company">
										<NavbarNestedItem
											to="/company/expenses"
											module="expenses">
											{t("nav.expenses", {
												ns: "translation",
											})}
										</NavbarNestedItem>
										<NavbarNestedItem
											to="/company/employees"
											module="employees">
											{t("nav.employees", {
												ns: "translation",
											})}
										</NavbarNestedItem>
										<NavbarNestedItem
											to="/company"
											module="company">
											{t("nav.company", {
												ns: "translation",
											})}
										</NavbarNestedItem>
									</NavbarDropdown>
								</>
							)}
							{/* Language Selector */}
							<li className="nav-item xl:border-l xl:ml-2 xl:pl-2 border-neutral-focus/30">
								<button
									onClick={() => setLangModalOpen(true)}
									className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-neutral-focus transition-all duration-200 text-neutral-content hover:text-white">
									<span className="font-medium">
										{language.nativeName}
									</span>
									<ReactCountryFlag
										svg
										countryCode={language.countryCode}
										className="text-xl"
									/>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			{/* Modals */}

			<LangSelect isOpen={isLangModalOpen} setIsOpen={setLangModalOpen} />
		</>
	);
}

function NavbarItem({ children, to = "/", module = null }) {
	const config = useConfig();
	const { icon } = config.getModule(module);

	const activeLink = ({ isActive }) => {
		if (isActive) {
			return "nav-active";
		} else {
			return "";
		}
	};
	return (
		<li className="nav-item">
			<NavLink to={to} className={activeLink}>
				{children}
				{icon && <Icon icon={icon} className="ml-1" />}
			</NavLink>
		</li>
	);
}

function NavbarNestedItem({ children, to = "/", module = null }) {
	const config = useConfig();
	const { icon } = config.getModule(module);
	const loc = useLocation();

	const activeLink = ({ isActive }) => {
		if (isActive) {
			if (loc.pathname === to) {
				return "nav-active";
			}
		}
		return "";
	};
	return (
		<li className="nav-item">
			<NavLink to={to} className={activeLink}>
				{children}
				{icon && <Icon icon={icon} className="ml-1" />}
			</NavLink>
		</li>
	);
}

function NavbarDropdown({ text = "dropdown", children, module = null }) {
	const [isOpen, setOpen] = useState(false);
	const handleClick = () => setOpen((state) => !state);
	//const openDropdown = () => setOpen(() => true);
	const closeDropdown = () => setOpen(() => false);
	const dropdownElement = useRef();
	useClickOutside(dropdownElement, closeDropdown);

	// const config = useConfig();
	// const icon = config.get(`modules.${module}.icon`);
	// const moduleChildren = config.get(`modules.${module}.children`);
	const loc = useLocation();
	let buttonClass = "";

	const config = useConfig();
	const { icon, children: moduleChildren } = config.getModule(module);

	// Close dropdown when location changes
	useEffect(() => {
		closeDropdown();
	}, [loc.pathname]);

	//Determine if this module or one of the sub-modules is active.
	//If so, display nav-active class for this dropdown toggle btn
	const paths = loc.pathname.split("/").filter((item) => item.length > 0); //Get each path item

	if (paths.includes(module)) {
		buttonClass = "nav-active";
	} else if (Array.isArray(moduleChildren)) {
		moduleChildren.forEach((key) => {
			if (typeof key !== "string") return;
			key = key.toLowerCase();
			if (paths.includes(key)) {
				buttonClass = "nav-active";
			}
		});
	}

	if (!children) {
		return <></>;
	}
	return (
		<li className="nav-dropdown nav-item" ref={dropdownElement}>
			<button
				onClick={handleClick}
				className={
					"flex items-center justify-start gap-2 " + buttonClass
				}>
				<span>{text}</span>
				{icon && <Icon icon={icon} />}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className={`w-4 h-4 transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<ul style={{ display: isOpen ? null : "none" }}>
				{/* Must have nav item childs */}
				{children}
			</ul>
		</li>
	);
}
