import React, { useState, useCallback } from 'react';
import { Table, Input, Form, Modal, Button, Space, Popconfirm, Select, Upload, Tooltip, Row, Col } from 'antd';
import { DeleteOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { setProuduct } from '../../elements/api/product';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducAction } from '../../redux/actions/allData';
import { photoCompress } from '../../lib/imageCompress';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import RichTextEditor from 'react-rte';
import { responseHelper } from '../../lib/response';
import { unique } from '../../lib/array';
import { SearchableTable } from '../../lib/serach';
import { VariableProduct } from './variable';

const type = 'DragableUploadList';

export const ProductPanel = () => {
	const [selectedProductId, setSelectedProductId] = useState([])
	const [form] = Form.useForm();
	const [data, setData] = useState([]);
	const [visible, setVisible] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [selectedID, setSelectedID] = useState(null)
	const [fileList, setFileList] = useState([])
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState(null)

	const [longDescription, setlongDescription] = useState(RichTextEditor.createEmptyValue())
	const [shortDes, setshortDes] = useState(RichTextEditor.createEmptyValue())

	const onChange = (value) => {
		setlongDescription(value);
	};

	const onChangeShort = (value) => {
		setshortDes(value);
	};

	const dispatch = useDispatch()
	const refresh = () => dispatch(setProducAction());

	const allDataReducer = useSelector(state => state.allDataReducer)

	const getMainName = (parentID) => {
		if (allDataReducer.parent.length) {
			return allDataReducer.parent.filter(({ id }) => id === parentID)[0]['name'] || "Deleted";
		}
	}

	const getMasterName = (parentID, isShow) => {
		if (allDataReducer.master.length) {
			let data = allDataReducer.master.filter(({ id }) => id === parentID)[0];
			if (data) {
				if (isShow) return ` ${getMainName(data['parentID'])} -- ${data['name']} --`;
				return { masterName: data['name'], parentName: getMainName(data['parentID']) }
			} else {
				if (isShow) return ` ${"Deleted"} -- ${"Deleted"} --`;
				return { masterName: "Deleted", parentName: "Deleted" }
			}
		}
	}

	const getSubMasterName = (parentID) => {
		if (allDataReducer.subMaster.length) {
			let data = allDataReducer.subMaster.filter(({ id }) => id === parentID)[0];
			if (data)
				return { subMastertName: data['name'], ...getMasterName(data['parentID']) }
			return { subMastertName: "Deleted", ...getMasterName(data['parentID']) }
		}
		return "none";
	}

	useEffect(() => {
		if (allDataReducer.product) {
			let res = allDataReducer.product;
			res = res.map(data => { return { ...data, ...getSubMasterName(data.parentID), key: data.id } })
			setData(res)
		}
	}, [allDataReducer.product])

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
			sorter: (a, b) => a.id - b.id,
			key: 'id'
		},
		{
			title: 'Name',
			dataIndex: 'name',
			width: '25%',
			key: 'name'

		},
		{
			title: 'SKU',
			dataIndex: 'sku',
			width: '25%',
			key: 'sku'

		},
		{
			title: 'Sub Master Name',
			dataIndex: 'subMastertName',
			width: '25%',
			key: 'submaster',
			filters: data && unique(data, "subMastertName").map(data => { return { text: data, value: data } }),
			onFilter: (value, record) => record.subMastertName.indexOf(value) === 0,
		},
		{
			title: 'Master Name',
			dataIndex: 'masterName',
			width: '25%',
			key: 'masterName',
			filters: data && unique(data, "masterName").map(data => { return { text: data, value: data } }),
			onFilter: (value, record) => record.masterName.indexOf(value) === 0,
		},
		{
			title: 'Main Category',
			dataIndex: 'parentName',
			width: '25%',
			key: 'parentName',
			filters: data && unique(data, "parentName").map(data => { return { text: data, value: data } }),
			onFilter: (value, record) => record.parentName.indexOf(value) === 0,
		},
		{
			key: 'action',
			title: 'Action',
			render: (data) => <Space>
				<Button type="primary" onClick={() => setSelectedID(data.id)}>Edit</Button>
				<Popconfirm title="Are you sure you want to delete this?" onConfirm={() => handleDelete(data.id)} >
					<Button type="primary" danger >Delete</Button>
				</Popconfirm>
				<Button onClick={() => handleDraft(data.id, data.draft)} >{data.draft === "1" ? "Undo" : "Draft"}</Button>
				<Button onClick={() => handleClone(data.id)}>Clone</Button>
				<VariableProduct productId={data.id} />
			</Space>
		}
	];

	const handleClone = async (id) => {
		let res = await setProuduct({ id, action: "CLONE" }, []);
		if (res.status !== "0") {
			dispatch(setProducAction());
			toast.success(res.msg);
		} else
			toast.error(res.msg);
	}

	const handleDraft = async (id, draftState) => {
		let draft = 0;
		if (draftState === "0")
			draft = 1;
		let res = await setProuduct({ id, draft, action: "DRAFT" }, []);
		if (res.status !== "0") {
			dispatch(setProducAction());
			toast.success(res.msg);
		} else
			toast.error(res.msg);
	}

	const deleteMulti = async () => {
		let allPromis = []
		if (selectedProductId.length === 0) {
			toast.error("No product selected")
			return;
		}
		for (let index = 0; index < selectedProductId.length; index++) {
			allPromis.push(setProuduct({ id: selectedProductId[index], action: "DELETE" }, []))
		}
		let res = await Promise.all(allPromis)
		setSelectedProductId([])
		dispatch(setProducAction());
	}

	const handleDelete = async (id) => {
		let res = await setProuduct({ id, action: "DELETE" }, []);
		if (res.status !== "0") {
			dispatch(setProducAction());
			toast.success(res.msg);
		} else
			toast.error(res.msg);
	}

	function isString(obj) {
		return obj !== undefined && obj !== null && obj.constructor == String;
	}

	useEffect(() => {
		if (selectedID !== null) {
			setVisible(true)
			setIsEdit(true)
			let formValue = data.filter(({ id }) => id === selectedID)[0]
			if (isString(formValue.details)) {
				formValue.details = formValue.details.replace(/\\n/g, "\\n")
					.replace(/\\'/g, "\\'")
					.replace(/\\"/g, '\\"')
					.replace(/\\&/g, "\\&")
					.replace(/\\r/g, "\\r")
					.replace(/\\t/g, "\\t")
					.replace(/\\b/g, "\\b")
					.replace(/\\f/g, "\\f");
				// remove non-printable and other non-valid JformValue.detailsON charformValue.details
				formValue.details = formValue.details.replace(/[\u0000-\u0019]+/g, "");
				formValue.details = JSON.parse(formValue.details)
			}
			if (formValue.colour && isString(formValue.colour)) {
				formValue.colour = formValue.colour.replace(/\\n/g, "\\n")
					.replace(/\\'/g, "\\'")
					.replace(/\\"/g, '\\"')
					.replace(/\\&/g, "\\&")
					.replace(/\\r/g, "\\r")
					.replace(/\\t/g, "\\t")
					.replace(/\\b/g, "\\b")
					.replace(/\\f/g, "\\f");
				// remove non-printable and other non-valid JformValue.colourON charformValue.colour
				formValue.colour = formValue.colour.replace(/[\u0000-\u0019]+/g, "");
				formValue.colour = JSON.parse(formValue.colour)
			}
			if (formValue.colour && isString(formValue.size)) {
				formValue.size = formValue.size.replace(/\\n/g, "\\n")
					.replace(/\\'/g, "\\'")
					.replace(/\\"/g, '\\"')
					.replace(/\\&/g, "\\&")
					.replace(/\\r/g, "\\r")
					.replace(/\\t/g, "\\t")
					.replace(/\\b/g, "\\b")
					.replace(/\\f/g, "\\f");
				// remove non-printable and other non-valid JformValue.sizeON charformValue.size
				formValue.size = formValue.size.replace(/[\u0000-\u0019]+/g, "");
				formValue.size = JSON.parse(formValue.size)
			}
			console.log(formValue)
			makeFileList(formValue.images)
			setlongDescription(RichTextEditor.createValueFromString(formValue.longDescription, 'html'))
			setshortDes(RichTextEditor.createValueFromString(formValue.description, 'html'))
			form.setFieldsValue({ ...formValue })
		}
	}, [selectedID])

	const makeFileList = (imagesName) => {
		const url = 'http://api.furnitureboutiq.com/upload/';
		let res = [];
		let parseData = imagesName.split(',');
		for (let index = 0; index < parseData.length; index++) {
			if (parseData[index] !== "") {
				const element = { name: parseData[index], uid: parseData[index], url: url + parseData[index] };
				res.push(element);
			}
		}
		setFileList(res);
	}
	const handleOk = async (value) => {
		if (isEdit) {
			if (value.details) {
				value.details = JSON.stringify(value.details);
			} else value.details = JSON.stringify({});
			if (value.colour) {
				value.colour = JSON.stringify(value.colour);
			} else value.colour = JSON.stringify({});
			if (value.size) {
				value.size = JSON.stringify(value.size);
			} else value.size = JSON.stringify({});
			const { compressImages, positionTracker } = await compress(fileList);
			delete value.files;
			const templongDescription = longDescription.toString('html')
			const tempShortDescription = shortDes.toString('html')
			let res = await setProuduct({ ...value, positionTracker, longDescription: templongDescription, description: tempShortDescription, id: selectedID, action: "UPDATE" }, compressImages)
			responseHelper(res, refresh)
		} else {
			if (value.details) {
				value.details = JSON.stringify(value.details);
			} else value.details = JSON.stringify({});
			if (value.colour) {
				value.colour = JSON.stringify(value.colour);
			} else value.colour = JSON.stringify({});
			if (value.size) {
				value.size = JSON.stringify(value.size);
			} else value.size = JSON.stringify({});

			const { compressImages, positionTracker } = await compress(fileList);
			delete value.files;
			const templongDescription = longDescription.toString('html')
			const tempShortDescription = shortDes.toString('html')
			let res = await setProuduct({ ...value, positionTracker, description: tempShortDescription, longDescription: templongDescription, action: "INSERT" }, compressImages)
			responseHelper(res, refresh)
		}
		onCancel()
	}

	const onCancel = () => {
		setSelectedID(null);
		form.resetFields();
		setIsEdit(false);
		setVisible(false)
		setFileList([])
		setlongDescription(RichTextEditor.createEmptyValue())
		setshortDes(RichTextEditor.createEmptyValue())
	}

	const compress = async (files) => {
		let allPromise = [];
		let positionTracker = "";
		let newFileCounter = 0;
		for (let i = 0; i < files.length; i++) {
			if (!files[i].url) {
				allPromise.push(photoCompress(files[i].originFileObj, { quality: 0.2 }), files[i].name)
				positionTracker += `pos__${newFileCounter},`
				newFileCounter++;
			} else {
				positionTracker += `${files[i].name},`
			}
		}
		let compressImages = await Promise.all(allPromise);
		return { compressImages, positionTracker };
	}

	const handleCancel = () => setPreviewVisible(false);

	function getBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}


	const handlePreview = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewVisible(true);
	};

	const handleUpload = ({ fileList }) => { console.log(fileList); setFileList(fileList) }


	const moveRow = useCallback(
		(dragIndex, hoverIndex) => {
			const dragRow = fileList[dragIndex];
			setFileList(
				update(fileList, {
					$splice: [
						[dragIndex, 1],
						[hoverIndex, 0, dragRow],
					],
				}),
			);
		},
		[fileList],
	);


	const validate = ({ sku }) => {
		if (sku !== "" && data.filter(data => data.sku === sku).length)
			toast.error("This sku is alredy given to some other product.")
	}

	const selectProduct = {
		selectedRowKeys: selectedProductId,
		onChange: (selectedRowKeys, selectedRows) => {
			let keyArray = selectedRowKeys.toString()
			if (keyArray) setSelectedProductId(keyArray.split(','));
			else setSelectedProductId([])
		},
		getCheckboxProps: (record) => ({
			disabled: record.name === 'Disabled User',
			// Column configuration not to be checked
			name: record.name,
		}),

	};
	return (
		<div>

			<Modal
				visible={visible}
				title={isEdit ? "Edit Product" : "Add New Product"}
				footer={null}
				width={'90vw'}
				onCancel={onCancel}
			>
				<Form id="product-form" form={form} layout="vertical" onFinish={handleOk} onValuesChange={validate} >
					<Form.Item rules={[{ required: true, message: "This is required" }]} label="Product Name" name="name">
						<Input />
					</Form.Item>
					<Form.Item rules={[{ required: true, message: "This is required" }]} label="SKU" name="sku">
						<Input />
					</Form.Item>
					<Form.Item rules={[{ required: true, message: "This is required" }]} label="Sub Master Name" name="parentID">
						<Select placeholder="please select ...">
							{allDataReducer.subMaster.map(data => <Select.Option value={data.id} key={data.id}>
								{`${getMasterName(data.parentID, true)} ${data.name}`}
							</Select.Option>)}
						</Select>
					</Form.Item>
					<div style={{ marginBottom: 20 }}>Short Description</div>
					<RichTextEditor
						value={shortDes}
						onChange={onChangeShort}
					/>
					<div style={{ marginBottom: 20, marginTop: 30 }}>Long Description</div>
					<RichTextEditor
						value={longDescription}
						onChange={onChange}
					/>
					<br />
					<br />
					<Form.List name="colour">
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, fieldKey, ...restField }) => (
									<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
										<Form.Item
											{...restField}
											name={[name, 'colour']}
											fieldKey={[fieldKey, 'colour']}
											rules={[{ required: true, message: 'Missing colour' }]}
										>
											<Input placeholder="Colour" />
										</Form.Item>
										<MinusCircleOutlined onClick={() => remove(name)} />
									</Space>
								))}
								<Form.Item>
									<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
										Add colour
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
					<Form.List name="size">
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, fieldKey, ...restField }) => (
									<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
										<Form.Item
											{...restField}
											name={[name, 'size']}
											fieldKey={[fieldKey, 'size']}
											rules={[{ required: true, message: 'Missing size' }]}
										>
											<Input placeholder="Size" />
										</Form.Item>
										<MinusCircleOutlined onClick={() => remove(name)} />
									</Space>
								))}
								<Form.Item>
									<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
										Add size
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
					<Row style={{ marginTop: 30 }} gutter={[16, 16]} >
						<Col xs={24} sm={24} md={12} lg={12} >
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
						</Col>
						<Col xs={24} sm={24} md={12} lg={12} >
							<Form.Item label="files">
								<Form.Item name="files" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
									<DndProvider backend={HTML5Backend}>
										<Upload.Dragger multiple={true} fileList={fileList}
											itemRender={(originNode, file, currFileList) => (
												<DragableUploadListItem
													originNode={originNode}
													file={file}
													fileList={currFileList}
													moveRow={moveRow}
												/>
											)}
											onPreview={handlePreview}
											onChange={handleUpload} beforeUpload={() => false} className="upload-list-inline" listType="picture" name="files"  >
											<p className="ant-upload-drag-icon">
												<InboxOutlined />
											</p>
											<p className="ant-upload-text">Click or drag file to this area to upload</p>
											<p className="ant-upload-hint">Support for a single or bulk upload.</p>
										</Upload.Dragger>
									</DndProvider>
									<Modal
										visible={previewVisible}
										title={"Image Preview"}
										footer={null}
										onCancel={handleCancel}
									>
										<img alt="example" style={{ width: '100%' }} src={previewImage} />
									</Modal>
								</Form.Item>
							</Form.Item>
						</Col>
					</Row>


					<Button type="primary" form="product-form" htmlType="submit" >{isEdit ? "Edit" : "Save"}</Button>
				</Form>
			</Modal>
			<Space>
				<Button onClick={() => setVisible(true)} icon={<PlusOutlined />} type="primary" >Add</Button>
				<Popconfirm title="Are you sure you want to delete all select product?" onConfirm={() => deleteMulti()} >
					<Button danger icon={<DeleteOutlined />} type="primary" >Delete Multiple</Button>
				</Popconfirm>
			</Space>
			<br />
			<br />
			<SearchableTable
				rowSelection={{
					type: 'checkbox',
					...selectProduct,
				}}
				dataSource={data}
				columns={columns}
				rowClassName="editable-row"
			/>
		</div >
	);
};

const DragableUploadListItem = ({ originNode, moveRow, file, fileList }) => {
	const ref = React.useRef();
	const index = fileList.indexOf(file);
	const [{ isOver, dropClassName }, drop] = useDrop({
		accept: type,
		collect: monitor => {
			const { index: dragIndex } = monitor.getItem() || {};
			if (dragIndex === index) {
				return {};
			}
			return {
				isOver: monitor.isOver(),
				dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
			};
		},
		drop: item => {
			moveRow(item.index, index);
		},
	});
	const [, drag] = useDrag({
		type,
		item: { index },
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	});
	drop(drag(ref));
	const errorNode = <Tooltip title="Upload Error">{originNode.props.children}</Tooltip>;
	return (
		<div
			ref={ref}
			className={`ant-upload-draggable-list-item ${isOver ? dropClassName : ''}`}
			style={{ cursor: 'move' }}
		>
			{file.status === 'error' ? errorNode : originNode}
		</div>
	);
};