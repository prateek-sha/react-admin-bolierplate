import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Table, Modal, Form, InputNumber, Select, Space, Input, DatePicker } from 'antd'
import moment from 'moment'
import { getAddress, sendMailByUser, setOrder } from '../../elements/api/other'
import { responseHelper } from '../../lib/response'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { setOrderAction } from '../../redux/actions/allData'
import { UserData } from '../../components/user'
import { useRef } from 'react'

export const UserPage = () => {

	const [data, setData] = useState([]);

	const allDataReducer = useSelector(state => state.allDataReducer)
	const [modalVisible, setModalVisible] = useState(false)
	const [selectedID, setSelectedID] = useState(null)
	const [userID, setUserID] = useState(null)
	const [form] = Form.useForm()
	const [type, setType] = useState("");

	const ref = useRef();

	const dispatch = useDispatch()
	useEffect(() => {
		if (allDataReducer.user) {
			let res = allDataReducer.user;
			setData(res)
		}
	}, [allDataReducer.user])

	useEffect(() => {
		if (selectedID) {
			setModalVisible(true)
		}
	}, [selectedID])
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			editable: false,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			editable: true,
		},
		{
			title: 'Date',
			dataIndex: 'created_on',
			editable: true,
			render: (date) => <>{moment(date).format('Do MMMM YYYY')}</>
		},
		{
			title: 'Action',
			render: (data) => <Space><Button type="primary" onClick={() => setSelectedID(data.id)} >Order</Button>
				<Button type="primary" onClick={() => setUserID(data.id)} >Details</Button></Space>
		},
		// {
		// 	title:'Action',
		// 	render:(data)=><Space>
		// 		{data.status === "1"  ?<Popconfirm  title="Are you sure you want to Block this user?" onConfirm={ () => handleDelete(data.id)} >
		//         	<Button type="primary" danger >Block</Button>
		// 		</Popconfirm> : 
		//         <Popconfirm  title="Are you sure you want to Un-Block this user?" onConfirm={ () => handleDelete(data.id)} >
		//         <Button type="primary">Un - Block</Button>
		//     </Popconfirm>}
		//     </Space>
		// }
	];

	// const handleDelete = async (id) => {
	// 	let res = await setUser({id, action:"TOGGLE"});
	// 	responseHelper(res, refresh);
	// }

	const handleClose = () => {
		setModalVisible(false);
		dispatch(setOrderAction())
		form.resetFields()
		setType("");
		setSelectedID(null);

	}

	const sendMail = async (productData, userData) => {
		const userMail = userData.email;
		const date = moment().format("DD MMMM YYYY")
		const orderID = userData.orderID
		const priceSection = userData.priceSection;
		let { shipping
			, processingTime
			, deliveryTime
			, shippingTime
			, paymentMode
			, shippingRate
			, tax
			, taxNumber, requestDate } = userData
		requestDate = moment(requestDate).format("DD MMMM YYYY")
		let total = 0;
		productData.map(data => {
			total = total + (parseInt(data.price) * parseInt(data.quantity))
		})
		const subTotal = total
		total += parseInt(shipping) + parseInt(tax);

		const getTabl = () => {
			let res = ""
			for (let i = 0; i < productData.length; i++) {
				const productName = productData[i].name;
				const productSKU = productData[i].sku
				const quantity = productData[i].quantity;
				const price = productData[i].price;
				const image = productData[i].images.split(',')[0];
				const imageUrl = "https://furnitureboutiq.com/api/upload/" + image;
				const productUrl = "https://furnitureboutiq.com/single-product/" + productData[i].id;

				res = res + `<div class="u-row-container" style="padding: 0px;background-color: transparent">
				<div class="u-row"
				  style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				  <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
					<!--[if (mso)|(IE)]><td align="center" width="120" style="width: 120px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-20"
					  style="max-width: 320px;min-width: 120px;display: table-cell;vertical-align: top;">
					  <div style="width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div
						  style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	
						  <table id="u_content_image_6" style="font-family:'Open Sans',sans-serif;" role="presentation"
							cellpadding="0" cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <table width="100%" cellpadding="0" cellspacing="0" border="0">
									<tr>
									  <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
	<a href=${productUrl}>
										<img align="center" border="0" src=${imageUrl} alt="Image" title="Image"
										  style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 100px;"
										  width="100" class="v-src-width v-src-max-width" />
	</a>
									  </td>
									</tr>
								  </table>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]><td align="center" width="143" style="width: 143px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-23p83"
					  style="max-width: 320px;min-width: 143px;display: table-cell;vertical-align: top;">
					  <div style="width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div
						  style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	
						  <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									<tbody>
									  <tr style="vertical-align: top">
										<td
										  style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
										  <span>&#160;</span>
										</td>
									  </tr>
									</tbody>
								  </table>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <table id="u_content_text_12" style="font-family:'Open Sans',sans-serif;" role="presentation"
							cellpadding="0" cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <div class="v-text-align v-line-height"
									style="color: #333333; line-height: 140%; text-align: center; word-wrap: break-word;">
									<a href=${productUrl}><p style="font-size: 14px; line-height: 140%;"><span
										style="font-size: 12px; line-height: 16.8px;">${productName} </span></p></a>
								  </div>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]><td align="center" width="97" style="width: 97px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-16p17"
					  style="max-width: 320px;min-width: 97px;display: table-cell;vertical-align: top;">
					  <div style="width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div
						  style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	
						  <table class="hide-mobile" style="font-family:'Open Sans',sans-serif;" role="presentation"
							cellpadding="0" cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									<tbody>
									  <tr style="vertical-align: top">
										<td
										  style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
										  <span>&#160;</span>
										</td>
									  </tr>
									</tbody>
								  </table>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <div class="v-text-align v-line-height"
									style="color: #333333; line-height: 140%; text-align: center; word-wrap: break-word;">
									<p style="font-size: 14px; line-height: 140%;"><span
										style="font-size: 14px; line-height: 19.6px;">${quantity}</span></p>
								  </div>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]><td align="center" width="120" style="width: 120px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-20"
					  style="max-width: 320px;min-width: 120px;display: table-cell;vertical-align: top;">
					  <div style="width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div
						  style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	
						  <table class="hide-mobile" style="font-family:'Open Sans',sans-serif;" role="presentation"
							cellpadding="0" cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									<tbody>
									  <tr style="vertical-align: top">
										<td
										  style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
										  <span>&#160;</span>
										</td>
									  </tr>
									</tbody>
								  </table>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <div class="v-text-align v-line-height"
									style="color: #333333; line-height: 140%; text-align: center; word-wrap: break-word;">
									<p style="font-size: 14px; line-height: 140%;"><span
										style="font-size: 14px; line-height: 19.6px;">${priceSection === "ruppe" ? "₹" : "$"} ${price}</span></p>
								  </div>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									<tbody>
									  <tr style="vertical-align: top">
										<td
										  style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
										  <span>&#160;</span>
										</td>
									  </tr>
									</tbody>
								  </table>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]><td align="center" width="120" style="width: 120px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-20"
					  style="max-width: 320px;min-width: 120px;display: table-cell;vertical-align: top;">
					  <div style="width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div
						  style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	
						  <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #ffffff;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									<tbody>
									  <tr style="vertical-align: top">
										<td
										  style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
										  <span>&#160;</span>
										</td>
									  </tr>
									</tbody>
								  </table>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <div class="v-text-align v-line-height"
									style="line-height: 140%; text-align: left; word-wrap: break-word;">
									<p style="font-size: 14px; line-height: 140%; text-align: center;">${priceSection === "ruppe" ? "₹" : "$"}${parseInt(price) * parseInt(quantity)}</p>
								  </div>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				  </div>
				</div>
			  </div>`
			}
			return res;
		}
		const mailContent = `<!DOCTYPE HTML
		PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
		xmlns:o="urn:schemas-microsoft-com:office:office">
	  
	  <head>
		<!--[if gte mso 9]>
	  <xml>
		<o:OfficeDocumentSettings>
		  <o:AllowPNG/>
		  <o:PixelsPerInch>96</o:PixelsPerInch>
		</o:OfficeDocumentSettings>
	  </xml>
	  <![endif]-->
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="x-apple-disable-message-reformatting">
		<!--[if !mso]><!-->
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<!--<![endif]-->
		<title></title>
	  
		<style type="text/css">
		  table,
		  td {
			color: #000000;
		  }
	  
		  a {
			color: #0000ee;
			text-decoration: underline;
		  }
	  
		  @media (max-width: 480px) {
			#u_content_text_1 .v-line-height {
			  line-height: 150% !important;
			}
	  
			#u_content_heading_3 .v-text-align {
			  text-align: center !important;
			}
	  
			#cs-Address .v-text-align {
			  text-align: left !important;
			}
	  
			#u_content_text_5 .v-text-align {
			  text-align: center !important;
			}
	  
			#u_content_text_7 .v-text-align {
			  text-align: center !important;
			}
	  
			#u_content_text_8 .v-text-align {
			  text-align: center !important;
			}
	  
			#u_content_text_4 .v-text-align {
			  text-align: center !important;
			}
	  
			#u_content_image_6 .v-src-width {
			  width: 640px !important;
			}
	  
			#u_content_image_6 .v-src-max-width {
			  max-width: 100% !important;
			}
	  
			#u_content_text_12 .v-text-align {
			  text-align: center !important;
			}
		  }
	  
		  @media only screen and (min-width: 620px) {
			.u-row {
			  width: 600px !important;
			}
	  
			.u-row .u-col {
			  vertical-align: top;
			}
	  
			.u-row .u-col-16p17 {
			  width: 97.02000000000002px !important;
			}
	  
			.u-row .u-col-16p67 {
			  width: 100.02000000000002px !important;
			}
	  
			.u-row .u-col-19 {
			  width: 114px !important;
			}
	  
			.u-row .u-col-20 {
			  width: 120px !important;
			}
	  
			.u-row .u-col-21p67 {
			  width: 130.02px !important;
			}
	  
			.u-row .u-col-22p66 {
			  width: 135.96px !important;
			}
	  
			.u-row .u-col-23p83 {
			  width: 142.98px !important;
			}
	  
			.u-row .u-col-50 {
			  width: 300px !important;
			}
	  
			.u-row .u-col-100 {
			  width: 600px !important;
			}
	  
		  }
	  
		  @media (max-width: 620px) {
			.u-row-container {
			  max-width: 100% !important;
			  padding-left: 0px !important;
			  padding-right: 0px !important;
			}
	  
			.u-row .u-col {
			  min-width: 320px !important;
			  max-width: 100% !important;
			  display: block !important;
			}
	  
			.u-row {
			  width: calc(100% - 40px) !important;
			}
	  
			.u-col {
			  width: 100% !important;
			}
	  
			.u-col>div {
			  margin: 0 auto;
			}
		  }
	  
		  body {
			margin: 0;
			padding: 0;
		  }
	  
		  table,
		  tr,
		  td {
			vertical-align: top;
			border-collapse: collapse;
		  }
	  
		  p {
			margin: 0;
		  }
	  
		  .ie-container table,
		  .mso-container table {
			table-layout: fixed;
		  }
	  
		  * {
			line-height: inherit;
		  }
	  
		  a[x-apple-data-detectors='true'] {
			color: inherit !important;
			text-decoration: none !important;
		  }
	  
		  @media (max-width: 480px) {
			.hide-mobile {
			  display: none !important;
			  max-height: 0px;
			  overflow: hidden;
			}
	  
		  }
		</style>
	  
	  
	  
		<!--[if !mso]><!-->
		<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css">
		<link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,700&display=swap" rel="stylesheet"
		  type="text/css">
		<!--<![endif]-->
	  
	  </head>
	  
	  <body class="clean-body"
		style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #efefef;color: #000000">
		<!--[if IE]><div class="ie-container"><![endif]-->
		<!--[if mso]><div class="mso-container"><![endif]-->
		<table
		  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #efefef;width:100%"
		  cellpadding="0" cellspacing="0">
		  <tbody>
			<tr style="vertical-align: top">
			  <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
				<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #efefef;"><![endif]-->
	  
	  
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
	  
	  
	  
				<div class="u-row-container" style="padding: 0px;background-color: #ecf0f1">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ecf0f1;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="background-color: #ffffff;width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table width="100%" cellpadding="0" cellspacing="0" border="0">
									  <tr>
										<td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
	  
										  <img align="center" border="0"
											src="https://furnitureboutiq.com/stagging/blogImages/image-1.png" alt="Image"
											title="Image"
											style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 600px;"
											width="600" class="v-src-width v-src-max-width" />
	  
										</td>
									  </tr>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
	  
	  
	  
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:16px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<table id="u_content_text_1" style="font-family:'Open Sans',sans-serif;" role="presentation"
							  cellpadding="0" cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align v-line-height"
									  style="color: #333333; line-height: 160%; text-align: center; word-wrap: break-word;">
									  <p style="font-size: 14px; line-height: 160%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 19.2px;">Thank
										  you for your interest. </span><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 19.2px;">We
										  have attached a brief summary of price. In order to send you a</span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 19.2px;">tailored
										  quotation. If you have any other query related to this proposal then feel free
										  to</span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 19.2px;">contact
										  us: <strong>fb@furnitureboutiq.com</strong> |
										  <strong>support@furnitureboutiq.com</strong></span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 19.2px;">Call
										  or Whatsapp: <strong>+91 76655 29259</strong></span></p>
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:5px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:16px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
	  
	  
	  
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #ffffff;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-50"
						style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
						<div style="background-color: #ffffff;width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table id="u_content_heading_3" style="font-family:'Open Sans',sans-serif;" role="presentation"
							  cellpadding="0" cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<h4 class="v-text-align v-line-height"
									  style="margin: 0px; color: #4c4c4c; line-height: 140%; text-align: left; word-wrap: break-word; font-weight: normal; font-family: helvetica,sans-serif; font-size: 16px;">
									  PROPOSAL TO
									</h4>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<table id="cs-Address" class="cs-Address" style="font-family:'Open Sans',sans-serif;"
							  role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align v-line-height"
									  style="color: #333333; line-height: 170%; text-align: left; word-wrap: break-word;">
									  <p style="font-size: 14px; line-height: 170%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 20.4px;"><strong>${userData.firstName || ""}
											${userData.lastName || ""}</strong></span></p>
									  <p style="font-size: 14px; line-height: 170%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 20.4px;">${userData.shpAddress1 || ""}</span>
									  </p>
									  <p style="font-size: 14px; line-height: 170%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 20.4px;">${userData.shpCity || ""}</span>
									  </p>
									  <p style="font-size: 14px; line-height: 170%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 20.4px;">${userData.shpZipcode || ""}</span>
									  </p>
									  <p style="font-size: 14px; line-height: 170%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 20.4px;">${userData.shpCountry || ""}</span>
									  </p>
									  <p style="font-size: 14px; line-height: 170%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 20.4px;">${userData.phoneNumber || ""}</span>
									  </p>
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #ffffff;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-50"
						style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
						<div style="background-color: #ffffff;width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 22px solid #ffffff;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align v-line-height"
									  style="color: #333333; line-height: 160%; text-align: left; word-wrap: break-word;">
									  <p style="font-size: 14px; line-height: 160%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 19.2px;">Proposal
										  no: ${orderID}</span></p>
									  <p style="font-size: 14px; line-height: 160%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 19.2px;">Date:
										  ${date}
										</span></p>
									  <p style="font-size: 14px; line-height: 160%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 19.2px;">Tax
										  no: ${taxNumber}</span></p>
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
						  </div>
						</div>
					  </div>
					</div>
				  </div>
				</div>
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #ffffff;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
	  
	  
	  
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #000000;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="background-color: #000000;width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table id="requestDate" class="requestDate" style="font-family:'Open Sans',sans-serif;"
							  role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align v-line-height"
									  style="color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word;">
									  <p style="font-size: 14px; line-height: 140%;"><span
										  style="color: #f1c40f; font-size: 14px; line-height: 19.6px; background-color: #000000;">Request
										  Date | </span>${requestDate}</p>
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
	  
	  
	  
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="background-color: #ffffff;width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #ffffff;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
	  
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				<div class="u-row"
				  style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
				  <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	
					<!--[if (mso)|(IE)]><td align="center" width="130" style="width: 130px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-21p67"
					  style="max-width: 320px;min-width: 130px;display: table-cell;vertical-align: top;">
					  <div style="width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div
						  style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	
						  <table id="u_content_text_5" style="font-family:'Open Sans',sans-serif;" role="presentation"
							cellpadding="0" cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:10px 15px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <div class="v-text-align v-line-height"
									style="color: #4c4c4c; line-height: 140%; text-align: left; word-wrap: break-word;">
									<p style="font-size: 14px; line-height: 140%;"><span
										style="font-size: 12px; line-height: 16.8px;"><strong><span
											style="line-height: 16.8px; font-size: 12px;">ITEMS
											ORDERED</span></strong></span></p>
								  </div>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]><td align="center" width="136" style="width: 136px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-22p66"
					  style="max-width: 320px;min-width: 136px;display: table-cell;vertical-align: top;">
					  <div style="width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div
						  style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	
						  <table id="u_content_text_7" style="font-family:'Open Sans',sans-serif;" role="presentation"
							cellpadding="0" cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:10px 15px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <div class="v-text-align v-line-height"
									style="color: #4c4c4c; line-height: 140%; text-align: center; word-wrap: break-word;">
									<p style="font-size: 14px; line-height: 140%;"><span
										style="font-size: 12px; line-height: 16.8px;"><strong><span
											style="line-height: 16.8px; font-size: 12px;">NAME</span></strong></span></p>
								  </div>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]><td align="center" width="114" style="width: 114px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-19"
					  style="max-width: 320px;min-width: 114px;display: table-cell;vertical-align: top;">
					  <div style="width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div
						  style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	
						  <table id="u_content_text_8" style="font-family:'Open Sans',sans-serif;" role="presentation"
							cellpadding="0" cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:10px 15px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <div class="v-text-align v-line-height"
									style="color: #4c4c4c; line-height: 140%; text-align: center; word-wrap: break-word;">
									<p style="font-size: 14px; line-height: 140%;"><span
										style="font-size: 12px; line-height: 16.8px;"><strong>QTY</strong></span></p>
								  </div>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]><td align="center" width="100" style="width: 100px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-16p67"
					  style="max-width: 320px;min-width: 100px;display: table-cell;vertical-align: top;">
					  <div style="width: 100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div
						  style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						  <!--<![endif]-->
	
						  <table id="u_content_text_4" style="font-family:'Open Sans',sans-serif;" role="presentation"
							cellpadding="0" cellspacing="0" width="100%" border="0">
							<tbody>
							  <tr>
								<td
								  style="overflow-wrap:break-word;word-break:break-word;padding:10px 15px;font-family:'Open Sans',sans-serif;"
								  align="left">
	
								  <div class="v-text-align v-line-height"
									style="color: #4c4c4c; line-height: 140%; text-align: center; word-wrap: break-word;">
									<p style="font-size: 14px; line-height: 140%;"><span
										style="font-size: 12px; line-height: 16.8px;"><strong>PRICE</strong></span></p>
								  </div>
	
								</td>
							  </tr>
							</tbody>
						  </table>
	
						  <!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					  </div>
					</div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]><td align="center" width="120" style="width: 120px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					<div class="u-col u-col-16p67"
					style="max-width: 320px;min-width: 100px;display: table-cell;vertical-align: top;">
					<div style="width: 100% !important;">
					  <!--[if (!mso)&(!IE)]><!-->
					  <div
						style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
						<!--<![endif]-->
  
						<table id="u_content_text_4" style="font-family:'Open Sans',sans-serif;" role="presentation"
						  cellpadding="0" cellspacing="0" width="100%" border="0">
						  <tbody>
							<tr>
							  <td
								style="overflow-wrap:break-word;word-break:break-word;padding:10px 15px;font-family:'Open Sans',sans-serif;"
								align="left">
  
								<div class="v-text-align v-line-height"
								  style="color: #4c4c4c; line-height: 140%; text-align: center; word-wrap: break-word;">
								  <p style="font-size: 14px; line-height: 140%;"><span
									  style="font-size: 12px; line-height: 16.8px;"><strong>TOTAl</strong></span></p>
								</div>
  
							  </td>
							</tr>
						  </tbody>
						</table>
  
						<!--[if (!mso)&(!IE)]><!-->
					  </div>
					  <!--<![endif]-->
					</div>
				  </div>
					<!--[if (mso)|(IE)]></td><![endif]-->
					<!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
				  </div>
				</div>
			  </div>
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px dotted #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
				${getTabl()}
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px dotted #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
	  
	  
	  
				<div class="u-row-container" style="padding: 0px;background-color: #ecf0f1">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ecf0f1;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #ffffff;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-50"
						style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
						<div style="background-color: #ffffff;width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align v-line-height"
									  style="line-height: 140%; text-align: left; word-wrap: break-word;">
									  <p style="font-size: 14px; line-height: 140%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">Shipping:${shipping}
										</span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">Processing
										  Time: &nbsp; ${processingTime} </span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">Delivery
										  Time: ${deliveryTime} &nbsp;</span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">Shipping
										  Mode: ${shippingTime} &nbsp;</span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">Payment
										  Mode:${paymentMode} </span></p>
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 22px solid #ffffff;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]><td align="center" width="300" style="background-color: #ffffff;width: 300px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-50"
						style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
						<div style="background-color: #ffffff;width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align v-line-height"
									  style="line-height: 140%; text-align: left; word-wrap: break-word;">
									  <p style="font-size: 14px; line-height: 140%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">Subtotal:&nbsp;
										  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${priceSection === "ruppe" ? "₹" :
				"$"} ${subTotal}</span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">Shipping:&nbsp;
										  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${priceSection === "ruppe" ? "₹" :
				"$"} ${shipping} </span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">Tax:
										  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
										  ${priceSection === "ruppe" ? "₹" : "$"}${tax} </span><br /><br /></p>
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align v-line-height"
									  style="line-height: 140%; text-align: left; word-wrap: break-word;">
									  <p style="font-size: 14px; line-height: 140%;"><span
										  style="font-size: 12px; line-height: 16.8px;">Total:&nbsp; &nbsp; &nbsp; &nbsp;
										  &nbsp; &nbsp;${priceSection === "ruppe" ? "₹" : "$"} ${total}</span></p>
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>

				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align" align="center">
									  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:'Open Sans',sans-serif;"><tr><td class="v-text-align" style="font-family:'Open Sans',sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:36px; v-text-anchor:middle; width:216px;" arcsize="11%" stroke="f" fillcolor="#faae3b"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Open Sans',sans-serif;"><![endif]-->
									  <a href="http://api.furnitureboutiq.com/order/order.php?accpetId=${orderID}" target="_blank"
										style="box-sizing: border-box;display: inline-block;font-family:'Open Sans',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #faae3b; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
										<span class="v-line-height"
										  style="display:block;padding:10px 20px;line-height:120%;"><span
											style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 14.4px;">Accpet
											</span></span>
									  </a>
									  <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>

				<div class="u-row-container" style="padding: 0px;background-color: #ecf0f1">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ecf0f1;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="background-color: #ffffff;width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align v-line-height"
									  style="line-height: 140%; text-align: left; word-wrap: break-word;">
									  <p style="font-size: 14px; line-height: 140%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;"><strong>Taxes
											and Custom Duty Policy-</strong></span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">Taxes:-
										  If any Local Taxes Applicable will be Borne by Buyer Only.</span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">Custom
										  Duties:- Custom Duties are Totally Payable By Buyer.</span></p>
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
	  
	  
	  
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align" align="center">
									  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;font-family:'Open Sans',sans-serif;"><tr><td class="v-text-align" style="font-family:'Open Sans',sans-serif;" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:36px; v-text-anchor:middle; width:216px;" arcsize="11%" stroke="f" fillcolor="#faae3b"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Open Sans',sans-serif;"><![endif]-->
									  <a href="" target="_blank"
										style="box-sizing: border-box;display: inline-block;font-family:'Open Sans',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #faae3b; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;">
										<span class="v-line-height"
										  style="display:block;padding:10px 20px;line-height:120%;"><span
											style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 14.4px;">Account
											Holder : Zara Industries</span></span>
									  </a>
									  <!--[if mso]></center></v:roundrect></td></tr></table><![endif]-->
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
	  
	  
	  
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align v-line-height"
									  style="line-height: 140%; text-align: left; word-wrap: break-word;">
									  <p style="font-size: 14px; line-height: 140%;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;"><span
											style="color: #7e8c8d; font-size: 12px; line-height: 16.8px;">Account
											no</span><span style="color: #7e8c8d; font-size: 12px; line-height: 16.8px;">:
										  </span><strong>50200050047651</strong></span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;"><span
											style="color: #7e8c8d; font-size: 12px; line-height: 16.8px;">Bank:
										  </span><strong>HDFC BANK LTD.</strong></span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;"><span
											style="color: #7e8c8d; font-size: 12px; line-height: 16.8px;">Address:</span><strong>
											Keshav Complex, No 15, Nimbera House, Mandore Rd, Jodhpur, Rajasthan
											342001</strong></span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;"><span
											style="color: #7e8c8d; font-size: 12px; line-height: 16.8px;">Swift:
										  </span><strong>HDFCINBBXXX</strong></span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;"><span
											style="color: #7e8c8d; font-size: 12px; line-height: 16.8px;">IFSC:</span>
										  <strong>HDFC0000986</strong></span><br /><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">Any
										  bank fees incurred for the payment of this invoice are the sole responsibility of
										  buyer.</span></p>
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<div class="v-text-align v-line-height"
									  style="line-height: 140%; text-align: left; word-wrap: break-word;">
									  <p style="font-size: 14px; line-height: 140%; text-align: center;"><span
										  style="font-family: 'Playfair Display', serif; font-size: 12px; line-height: 16.8px;">42,
										  Hariom Tower, Manji Ka Hatha, Paota, Jodhpur Rajasthan Iindia 342006</span></p>
									</div>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
	  
	  
	  
				<div class="u-row-container" style="padding: 0px;background-color: transparent">
				  <div class="u-row"
					style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
					<div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
					  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
	  
					  <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
					  <div class="u-col u-col-100"
						style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
						<div style="width: 100% !important;">
						  <!--[if (!mso)&(!IE)]><!-->
						  <div
							style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
							<!--<![endif]-->
	  
							<table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0"
							  cellspacing="0" width="100%" border="0">
							  <tbody>
								<tr>
								  <td
									style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Open Sans',sans-serif;"
									align="left">
	  
									<table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
									  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
									  <tbody>
										<tr style="vertical-align: top">
										  <td
											style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
											<span>&#160;</span>
										  </td>
										</tr>
									  </tbody>
									</table>
	  
								  </td>
								</tr>
							  </tbody>
							</table>
	  
							<!--[if (!mso)&(!IE)]><!-->
						  </div>
						  <!--<![endif]-->
						</div>
					  </div>
					  <!--[if (mso)|(IE)]></td><![endif]-->
					  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
					</div>
				  </div>
				</div>
	  
	  
				<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
			  </td>
			</tr>
		  </tbody>
		</table>
		<!--[if mso]></div><![endif]-->
		<!--[if IE]></div><![endif]-->
	  </body>
	  
	  </html>`

		let res = await sendMailByUser({ message: mailContent, userMail, subject: "Furniture BoutiQ Proposal" });
		responseHelper(res, () => { })

	}


	useEffect(() => {
		if (ref.current && type !== "")
			form.submit()
		else ref.current = true;
	}, [type])

	const onSubmit = async (value) => {
		let product = value.product.map(data => data.product).join(',')
		let price = value.product.map(data => data.price).join(',')
		let quantity = value.product.map(data => data.quantity).join(',')

		let productData = product.split(',').map((idd, count) => {
			return {
				price: price.split(',')[count],
				quantity: quantity.split(',')[count],
				...allDataReducer.product.filter(data =>
					data.id === idd
				)[0]
			}
		});
		let addressData = {}
		let ress = await getAddress({ parentID: selectedID })
		if (ress.status === "1") {
			addressData = ress.data[0]
		}
		let userData = data.filter(data => data.id === selectedID)[0];


		let res = await setOrder({
			action: "INSERT",
			price: price,
			userID: selectedID,
			productID: product,
			track: "",
			paymentStatus: "pending",
			orderStatus: "active",
			quantity: quantity,
			priceSection: value.priceSection,
			accpet: type === "req" ? 0 : 1
		});
		const handleMail = (orderID) => sendMail(productData, { ...userData, ...addressData, priceSection: value.priceSection, orderID, ...value });
		responseHelper(res, () => {
			handleMail(res["last_id"])
			handleClose()
		})


	}


	return (
		<div>
			<UserData id={userID} onCancel={() => setUserID(null)} />
			<Modal
				onCancel={handleClose}
				visible={modalVisible}
				title="Create a Order"
				width="60vw"
				footer={null}
			>
				<Form form={form} onFinish={onSubmit} >
					<Form.Item name="requestDate" label="Request Date" rules={[{ required: true, message: 'Missing' }]}>
						<DatePicker />
					</Form.Item>
					<Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="lastName" label="Last Name " rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="shpAddress1" label="Address" rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="shpCity" label="City " rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="shpZipcode" label="Zip Code " rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="shpCountry" label="Country " rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="phoneNumber" label="Phone Number " rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="taxNumber" label="Tax Number " rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item>
					<Form.Item name="shipping" label="Shipping " rules={[{ required: true, message: 'Missing' }]}>
						<InputNumber />
					</Form.Item><Form.Item name="processingTime" label="Processing Time " rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item><Form.Item name="deliveryTime" label="Delivery Time " rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item><Form.Item name="shippingTime" label="Shipping time " rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item><Form.Item name="paymentMode" label="Payment Mode " rules={[{ required: true, message: 'Missing' }]}>
						<Input />
					</Form.Item><Form.Item name="tax" label="Tax" rules={[{ required: true, message: 'Missing' }]} >
						<InputNumber />
					</Form.Item>
					<Form.Item name="priceSection" label="Price " rules={[{ required: true, message: 'Missing' }]} >
						<Select>
							<Select.Option value="dollar"> Dollar</Select.Option>
							<Select.Option value="ruppe" >Ruppe</Select.Option>
						</Select>
					</Form.Item>
					<Form.List name="product">
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, fieldKey, ...restField }) => (
									<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
										<Form.Item
											{...restField}
											name={[name, 'product']}
											fieldKey={[fieldKey, 'product']}
											rules={[{ required: true, message: 'Missing Product' }]}
										>
											<Select showSearch
												filterOption={(input, option) =>
													option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
												}
												placeholder="please selete ...">
												{allDataReducer.product && allDataReducer.product.filter(d => d.draft === "0").
													map(productData =>
														<Select.Option value={productData.id} >
															{productData.name}
														</Select.Option>
													)}
											</Select>
										</Form.Item>
										<Form.Item
											{...restField}
											name={[name, 'price']}
											fieldKey={[fieldKey, 'price']}
											rules={[{ required: true, message: 'Missing Price' }]}
										>
											<InputNumber placeholder="price" />
										</Form.Item>
										<Form.Item
											{...restField}
											name={[name, 'quantity']}
											fieldKey={[fieldKey, 'quantity']}
											rules={[{ required: true, message: 'Missing Quantity' }]}
										>
											<InputNumber placeholder="quantity" />
										</Form.Item>
										<MinusCircleOutlined onClick={() => remove(name)} />
									</Space>
								))}
								<Form.Item>
									<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
										Add Product
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
					<Button type="primary" onClick={() => setType("req")}>
						Send Request
					</Button>
					<Button type="primary" onClick={() => setType("send")}>
						Submit
					</Button>
				</Form>

			</Modal>
			<Table
				dataSource={data}
				columns={columns}
				rowClassName="editable-row"
			/>
		</div >
	)
}
