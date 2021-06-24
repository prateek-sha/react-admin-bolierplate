export const menuLayout = [
	{
		type: "parent",
		title: "Products",
		key: 1,
		view: "MainCategoryPanel",
		children: [
			{
				type: "root",
				title: "Main Category",
				key: 2,
				view: "MainCategoryPanel"
			},
			{
				type: "root",
				title: "Master",
				key: 3,
				view: "MasterPanel"
			},
			{
				type: "root",
				title: "Sub Master",
				key: 4,
				view: "SubMasterPanel"
			},
			{
				type: "root",
				title: "Product",
				key: 5,
				view: "ProductPanel"
			},
		]
	},
	{
		type: "root",
		title: "Quotes",
		key: 6,
		view: "QuotePage"
	},
	{
		type: "root",
		title: "Favourites",
		key: 6,
		view: "FavouritePage"
	},
	{
		type: "root",
		title: "User",
		key: 7,
		view: "UserPage"
	},
	{
		type: "root",
		title: "Order",
		key: 8,
		view: "OrderPage"
	}
];
