import React from "react";
import { useTranslation } from "react-i18next";
import useApp from "../../context/app/useApp";
import ResponsiveModal from "../common/ResponsiveModal";

export default function ThemeSelect({ isOpen = false, setIsOpen }) {
	const { theme } = useApp();
	const { t } = useTranslation();

	if (!isOpen || !theme) {
		return <></>;
	}
	return (
		<ResponsiveModal
			title={t("themeSelect.title")}
			handleClose={() => setIsOpen(false)}>
			<ul>
				{theme.all.map((item, i) => {
					return (
						<li key={i}>
							<button
								className={
									"btn btn-ghost btn-outline mb-1 w-full justify-center btn-md text-xl capitalize " +
									(item === theme.active ? "btn-active" : "")
								}
								onClick={() => {
									setIsOpen(false);
									theme.change(item);
								}}>
								{t(`themes.${item}`, { defaultValue: item })}
							</button>
						</li>
					);
				})}
			</ul>
		</ResponsiveModal>
	);
}
