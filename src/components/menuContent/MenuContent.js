import React, { useEffect } from "react";
import { menuLayout } from "../../elements/layout/AppControllerLayout";
import { setActiveDashboard } from "../../redux/actions/dashBoard";

import { useSelector, useDispatch } from "react-redux";
import { FavouritePage } from '../../pages/favourite'
import { OrderPage  } from '../../pages/order'
import { ProductPage } from '../../pages/product'
import {  QuotePage } from '../../pages/quote'
import {  UserPage } from '../../pages/user'


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
		case "ProductPage":
			return <ProductPage />
		case "UserPage":
			return <UserPage />
		case "FavouritePage":
			return <FavouritePage />
		case "QuotePage":
			return <QuotePage />
		case "OrderPage":
			return <OrderPage />
		default:
			return <></>;
	}
};
