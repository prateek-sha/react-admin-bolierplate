import { toast } from "react-toastify";
import { encodeParams, modifyFetch } from "../../lib/apiHelper";

let USER_URL = "http://api.furnitureboutiq.com/user";
let ORDER_URL = "http://api.furnitureboutiq.com/order";
let QUOTE_URL = "http://api.furnitureboutiq.com/quote";
let FAVOURITE_URL = "http://api.furnitureboutiq.com/favourite";
let ADMIN_URL = "http://api.furnitureboutiq.com/admin";
let EXTRA_URL = "http://api.furnitureboutiq.com/extra";
let SLIDER_URL = "http://api.furnitureboutiq.com/slider";
let ADDRESS_URL = "http://api.furnitureboutiq.com/address";
let MAIL_URL = "https://furnitureboutiq.com/api/mail";
export const setUser = async (query) => {
	let formData = new FormData();
	for (var key in query) {
		formData.append(key, query[key]);
	}
	const response = await modifyFetch(`${USER_URL}/user.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};

export const getUser = async () => {
	const response = await modifyFetch(`${USER_URL}/user.php?${encodeParams({ user: 'ADMIN' })}`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}

export const setOrder = async (query) => {
	let formData = new FormData();
	for (var key in query) {
		formData.append(key, query[key]);
	}
	const response = await modifyFetch(`${ORDER_URL}/order.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};

export const getOrder = async () => {
	const response = await modifyFetch(`${ORDER_URL}/order.php`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}

export const setQuote = async (query) => {
	let formData = new FormData();
	for (var key in query) {
		formData.append(key, query[key]);
	}
	const response = await modifyFetch(`${QUOTE_URL}/quote.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};

export const getQuote = async () => {
	const response = await modifyFetch(`${QUOTE_URL}/quote.php`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}


export const getFavourite = async () => {
	let item = await getFavouriteItem();
	let list = await getFavouriteList();

	if (item !== "0" && item !== "0") {

		const getParticularItem = (id) => {
			return item.data.filter(data => data.parentID === id).map(filterData => filterData.productID) || [];
		}

		let res = list.data.map(data => { return { ...data, favlistName: [] } })
		const arrayHashmap = res.reduce((obj, item) => {
			obj[item.parentID] ? obj[item.parentID].favlistName.push({ name: item.name, id: item.id }) : (obj[item.parentID] = { ...item });
			return obj;
		}, {});

		let mergedArray = Object.values(arrayHashmap);

		mergedArray = mergedArray.map(data => {
			return {
				parentID: data.parentID,
				favlistName: [...data.favlistName, { name: data.name, id: data.id }]
			}
		})

		mergedArray = mergedArray.map((data, idx) => {
			return {
				...data,
				key: idx,
				favlistName: data.favlistName.map(innerData => {
					return {
						...innerData,
						children: getParticularItem(innerData.id)
					}
				})
			}
		})
		return { data: mergedArray, status: "1" }
	} else {
		return { data: [], status: "0" }
	}
}

export const getFavouriteItem = async () => {
	const response = await modifyFetch(`${FAVOURITE_URL}/item.php`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}


export const getFavouriteList = async () => {
	const response = await modifyFetch(`${FAVOURITE_URL}/list.php`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}


export const changePassAdmin = async (query) => {
	let formData = new FormData();
	for (var key in query) {
		formData.append(key, query[key]);
	}
	const response = await modifyFetch(`${ADMIN_URL}/admin.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};

export const login = async (query) => {
	let formData = new FormData();
	for (var key in query) {
		formData.append(key, query[key]);
	}
	const response = await modifyFetch(`${ADMIN_URL}/login.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};


export const setExtra = async (query) => {
	let formData = new FormData();
	for (var key in query) {
		formData.append(key, query[key]);
	}
	const response = await modifyFetch(`${EXTRA_URL}/extra.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};

export const getExtra = async () => {
	const response = await modifyFetch(`${EXTRA_URL}/extra.php`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}

export const setSlider = async (query, files) => {
	let formData = new FormData();
	for (var key in query) {
		formData.append(key, query[key]);
	}
	for (var index = 0; index < files.length; index++) {
		formData.append("files[]", files[index]);
	}
	const response = await modifyFetch(`${SLIDER_URL}/slider.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};



export const getSlider = async () => {
	const response = await modifyFetch(`${SLIDER_URL}/slider.php`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}

export const getAddress = async (value) => {
	const response = await modifyFetch(`${ADDRESS_URL}/address.php?${encodeParams({ ...value })}`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}
export const sendMailByUser = async (query) => {
	let formData = new FormData();
	for (var key in query) {
		formData.append(key, query[key]);
	}
	const response = await modifyFetch(`${MAIL_URL}/mail.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};