import React, { useState } from 'react';
import { Table, Input, Form, Modal, Button, Space, Popconfirm, Select, Upload } from 'antd';
import { InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { getParent, setParent, setProuduct } from '../../elements/api/product';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty';
import { useDispatch, useSelector } from 'react-redux';
import { setProducAction } from '../../redux/actions/product';
import { convertBase64UrlToBlob, photoCompress } from '../../lib/imageCompress';


export const ProductPanel = () => {
	const [form] = Form.useForm();
	const [data, setData] = useState([]);
	const [name, setName] = useState('');
	const [visible, setVisible] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [selectedID, setSelectedID] = useState(null)
	const [fileList, setFileList] = useState([])

	const dispatch = useDispatch()

	const productReducer = useSelector(state => state.productReducer)

	const getSubMasterName = (parentID) => {
		if (productReducer.subMaster.length) {
			return productReducer.subMaster.filter(({ id }) => id === parentID)[0]['name'];
		} 
		return "none";
	}

	useEffect(() => {
		if (productReducer.product.length) {
			let res = productReducer.product;
			res = res.map(data => { return { ...data, subMastertName: getSubMasterName(data.parentID) } })
			setData(res)
		}
	}, [productReducer.product])

	const normFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e && e.fileList;
	};

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			width: '15%',
			editable: false,
		},
		{
			title: 'Name',
			dataIndex: 'name',
			width: '25%',
			editable: true,
		},
		{
			title: 'Sub Master Name',
			dataIndex: 'subMastertName',
			width: '25%',
			editable: true,
		},
		{
			title: 'Action',
			render: (data) => <Space>
				<Button type="primary" onClick={() => setSelectedID(data.id)}>Edit</Button>
				<Popconfirm title="Are you sure you want to delete this?" onConfirm={() => handleDelete(data.id)} >
					<Button type="primary" danger >Delete</Button>
				</Popconfirm>
			</Space>
		}
	];

	const handleDelete = async (id) => {
		let res = await setProuduct({ id, action: "DELETE" });
		if (res.status !== "0") {
			dispatch(setProducAction);
			toast.success(res.msg);
		} else
			toast.error(res.msg);
	}

	useEffect(() => {
		if (selectedID !== null) {
			setVisible(true)
			setIsEdit(true)
			let formValue = data.filter(({ id }) => id === selectedID)[0]
			console.log(formValue)
			form.setFieldsValue({ ...formValue })
		}
	}, [selectedID])


	const handleOk = async (value) => {		
		if(value.details){
			value.details = JSON.stringify(value.details);
		}else value.details = "None";

		value.files = await  compress(value.files)
		let files = value.files;
		delete value.files;
		let res = await setProuduct({...value, action:"INSERT"}, files)
		if(res.status !== "0"){
			toast.success(res.msg)
		}else{
			toast.error(res.msg)
		}
		dispatch(setProducAction);
		setVisible(false);
	}	

	const onCancel = () => {
		setName('');
		setVisible(false)
	}

	const uploadProps = {
		onRemove: file => {
			const index = fileList.indexOf(file);
			const newFileList = fileList.slice();
			newFileList.splice(index, 1);
			setFileList(newFileList)
			return {
				fileList: newFileList,
			};
		},
		beforeUpload: file => {
			setFileList([...fileList, file])
			return false;
		},
		fileList,
	};

	const compress = async (files) => {
		let allPromise = []
		for(let i=0; i<files.length; i++){
			allPromise.push(photoCompress(files[i].originFileObj, {quality: 0.2}))
		}
		let res =  await Promise.all(allPromise);
		console.log(res)
		return res;
	}

	return (
		<div>
			<Modal
				visible={visible}
				title={isEdit ? "Edit Product" : "Add New Product"}
				footer={null}
				onCancel={onCancel}
			>
				<Form id="product-form" form={form} layout="vertical" onFinish={handleOk}>
					<Form.Item label="Product Name" name="name">
						<Input />
					</Form.Item>
					<Form.Item label="Sub Master Name" name="parentID">
						<Select placeholder="please select ...">
							{productReducer.subMaster.map(data => <Select.Option value={data.id} key={data.id}>{data.name}</Select.Option>)}
						</Select>
					</Form.Item>
					<Form.Item label="Description" name="description">
						<Input.TextArea />
					</Form.Item>
					<Form.List name="details">
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, fieldKey, ...restField }) => (
									<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
										<Form.Item
											{...restField}
											name={[name, 'Features']}
											fieldKey={[fieldKey, 'features']}
											rules={[{ required: true, message: 'Missing Feature' }]}
										>
											<Input placeholder="Features" />
										</Form.Item>
										<Form.Item
											{...restField}
											name={[name, 'Value']}
											fieldKey={[fieldKey, 'value']}
											rules={[{ required: true, message: 'Missing value' }]}
										>
											<Input placeholder="value.." />
										</Form.Item>
										<MinusCircleOutlined onClick={() => remove(name)} />
									</Space>
								))}
								<Form.Item>
									<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
										Add feature
									</Button>
								</Form.Item>

							</>
						)}
					</Form.List>
					<Form.Item label="files">
						<Form.Item name="files" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
							<Upload.Dragger name="files" {...uploadProps} >
								<p className="ant-upload-drag-icon">
									<InboxOutlined />
								</p>
								<p className="ant-upload-text">Click or drag file to this area to upload</p>
								<p className="ant-upload-hint">Support for a single or bulk upload.</p>
							</Upload.Dragger>
						</Form.Item>
					</Form.Item>
					<Button type="primary" form="product-form" htmlType="submit" >{isEdit ? "Edit" : "Save"}</Button>
				</Form>
			</Modal>
			<Button onClick={() => setVisible(true)} icon={<PlusOutlined />} type="primary" >Add</Button><br />
			<br />
			<Table
				dataSource={data}
				columns={columns}
				rowClassName="editable-row"
			/>
		</div>
	);
};

