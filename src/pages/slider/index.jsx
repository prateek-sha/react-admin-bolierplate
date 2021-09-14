import React, { useState, useCallback, useEffect } from 'react'
import { Form, Upload, Button, Input } from 'antd'
import { photoCompress } from '../../lib/imageCompress';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { responseHelper } from '../../lib/response';
import { InboxOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import { Tooltip } from 'antd';
import { getSlider, setSlider } from '../../elements/api/other';
import { toast } from 'react-toastify';
const type = 'DragableUploadList';

export const SliderPage = () => {

	const normFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e && e.fileList;
	};

	const [data, setData] = useState([])
	const [fileList, setFileList] = useState([])
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewImage, setPreviewImage] = useState(null)
	const [form] = Form.useForm();

	useEffect(() => {
		init()
	}, [])

	const init = async () => {
		let res = await getSlider();
		if (res.status !== "0") {
			let formValue = res.data[0]
			makeFileList(formValue.images)
			form.setFieldsValue({ ...formValue })
			toast.success(res.msg);
		} else
			toast.error(res.msg);
	}

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

	const handleOk = async (value) => {
		const { compressImages, positionTracker } = await compress(fileList);
		delete value.files;
		let res = await setSlider({ ...value, positionTracker, id: '1', action: "UPDATE" }, compressImages)
		responseHelper(res, () => init())
	}

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


	return (
		<div>
			<Form id="product-form" form={form} layout="vertical" onFinish={handleOk} >
				<Form.Item rules={[{ required: true, message: "This is required" }]} label="Upper Name" name="name1">
					<Input />
				</Form.Item>
				<Form.Item rules={[{ required: true, message: "This is required" }]} label="Below Name" name="name2">
					<Input />
				</Form.Item>
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
				<Button type="primary" form="product-form" htmlType="submit" >{"Edit"}</Button>
			</Form>
		</div>
	)
}

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