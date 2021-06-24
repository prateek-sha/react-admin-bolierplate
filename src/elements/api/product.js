import { toast } from "react-toastify";
import { encodeParams, modifyFetch } from "../../lib/apiHelper";

let URL = "http://api.furnitureboutiq.com/products";

export const setParent = async (query) => {
    let formData = new FormData();
    for ( var key in query ) {
        formData.append(key, query[key]);
    }
	const response = await modifyFetch(`${URL}/parent.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};

export const getParent = async () => {
	const response = await modifyFetch(`${URL}/parent.php`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}

export const setMaster = async (query) => {
    let formData = new FormData();
    for ( var key in query ) {
        formData.append(key, query[key]);
    }
	const response = await modifyFetch(`${URL}/master.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};

export const getMaster = async () => {
	const response = await modifyFetch(`${URL}/master.php`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}

export const setSubMaster = async (query) => {
    let formData = new FormData();
    for ( var key in query ) {
        formData.append(key, query[key]);
    }
	const response = await modifyFetch(`${URL}/subMaster.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};

export const getSubMaster = async () => {
	const response = await modifyFetch(`${URL}/subMaster.php`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}

export const setProuduct = async (query, files) => {
    let formData = new FormData();
    for ( var key in query ) {
        formData.append(key, query[key]);
    }
	for (var index = 0; index < files.length; index++) {
		formData.append("files[]", files[index]);
	}
	const response = await modifyFetch(`${URL}/product.php`, {
		method: 'POST',
		body: formData
	});
	const body = await response.json();
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
};

export const getProduct = async () => {
	const response = await modifyFetch(`${URL}/product.php`);
	const body = await response.json()
	if (response.status !== 200) { toast.error(body.message || "some error occured, please try sometime later"); }
	return body;
}

