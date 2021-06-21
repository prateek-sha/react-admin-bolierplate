import React, { useEffect } from "react";
import { menuLayout } from "../../elements/layout/AppControllerLayout";
import { setActiveDashboard } from "../../redux/actions/dashBoard";

import { useSelector, useDispatch } from "react-redux";


export const MenuContent = () => {
	const dashboard = useSelector(state => state.dashboard);
	const dispatch = useDispatch();

	const initMenuContent = () => {
		if (dashboard.activeDashBoard === "") {
			dispatch(setActiveDashboard(menuLayout[0].view));
		} else {
			dispatch(setActiveDashboard(dashboard.activeDashBoard));
		}
	};

	useEffect(() => {
		initMenuContent();
	}, [dashboard.activeDashBoard]);

	switch (dashboard.activeDashBoard) {
		default:
			return <></>;
	}
};
