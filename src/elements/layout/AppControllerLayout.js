export const menuLayout = [
	{
		type: "parent",
		title: "Products",
		key: 'sub1',
		view: "MainCategoryPanel",
		children: [
			{
				type: "root",
				title: "Main Category",
				key: 1,
				view: "MainCategoryPanel"
			},
			{
				type: "root",
				title: "Master",
				key: 2,
				view: "MasterPanel"
			},
			{
				type: "root",
				title: "Sub Master",
				key: 3,
				view: "SubMasterPanel"
			},
			{
				type: "root",
				title: "Product",
				key: 4,
				view: "ProductPanel"
			},
		]
	},
	{
		type: "root",
		title: "Slider",
		key: 15,
		view: "SliderPage"
	},
	{
		type: "root",
		title: "Quotes",
		key: 5,
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
	},
	{
		type: "root",
		title: "Pages Data",
		key: 9,
		view: "PagesData"
	}
];
