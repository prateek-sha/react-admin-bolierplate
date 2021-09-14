import React, { useState, useCallback, useEffect } from 'react';
import { Table, Input, Form, Modal, Button, Space, Popconfirm, Select, Upload, Tooltip, Row, Col } from 'antd';
import { DeleteOutlined, InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { photoCompress } from '../../lib/imageCompress';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import _isEmpty from 'lodash/isEmpty'
import update from 'immutability-helper';
import { responseHelper } from '../../lib/response';
import { unique } from '../../lib/array';
import { setProducAction } from '../../redux/actions/allData';
import { setColorImage, setProuduct } from '../../elements/api/product';

function isString(obj) {
    return obj !== undefined && obj !== null && obj.constructor == String;
}
const type = 'DragableUploadList';
export const VariableProduct = ({ productId }) => {


    const [form] = Form.useForm();

    const [data, setData] = useState([])
    const [selectedID, setSelectedID] = useState(null)
    const [fileList, setFileList] = useState([])
    const [allFilesData, setAllFilesData] = useState(null)
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState(null)
    const [visible, setVisible] = useState(false)
    const [colour, setColour] = useState([])

    const dispatch = useDispatch()

    const refresh = () => dispatch(setProducAction());

    const allDataReducer = useSelector(state => state.allDataReducer)


    useEffect(() => {
        if (allDataReducer.product) {
            let res = allDataReducer.product;
            init(res)
        }
    }, [allDataReducer.product])

    const init = (data) => {
        let formValue = data.filter(({ id }) => id === productId)[0]

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

        if (formValue.colourImage && isString(formValue.colourImage)) {
            formValue.colourImage = formValue.colourImage.replace(/\\n/g, "\\n")
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, "\\&")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t")
                .replace(/\\b/g, "\\b")
                .replace(/\\f/g, "\\f");
            // remove non-printable and other non-valid JformValue.colourImageON charformValue.colourImage
            formValue.colourImage = formValue.colourImage.replace(/[\u0000-\u0019]+/g, "");
            formValue.colourImage = JSON.parse(formValue.colourImage)
        }
        console.log(productId)
        console.log(formValue.colour)
        if (formValue.colour && !_isEmpty(formValue.colour))
            setColour(formValue.colour)
        if (formValue.colourImage && !_isEmpty(formValue.colourImage))
            setAllFilesData(formValue.colourImage)
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

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleOkVariable = async (value) => {
        const { compressImages, positionTracker } = await compress(fileList);
        let res = await setColorImage({ positionTracker }, compressImages)
        if (res.images) {
            let tempAllFiles = {}
            if (allFilesData)
                tempAllFiles = { ...allFilesData }
            Object.assign(tempAllFiles, { [value.colour]: res.images })
            if (tempAllFiles) {
                tempAllFiles = JSON.stringify(tempAllFiles);
            } else tempAllFiles = JSON.stringify({});
            let resp = setProuduct({ action: "UPDATECOLOURIMAGE", id: productId, colourImage: tempAllFiles }, [])
            responseHelper(res, () => refresh())
        }
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

    const colourChange = (value) => {
        if (value.colour && allFilesData) {
            if (allFilesData[value.colour])
                makeFileList(allFilesData[value.colour])
            else
                makeFileList("")
        }
    }
    const onCancel = () => {
        setVisible(false)
    }

    return (
        <div>
            <Modal
                visible={visible}
                title={"Add variable"}
                footer={null}
                width={'90vw'}
                onCancel={onCancel}
            >
                <Form id="variable-form" form={form} layout="vertical" onFinish={handleOkVariable} onValuesChange={colourChange}  >
                    <Form.Item label="files" name="colour" >
                        <Select placeholder="Select colour">
                            {colour.map(data => <Select.Option value={data.colour} >{data.colour}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Row style={{ marginTop: 30 }} gutter={[16, 16]} >
                        <Col xs={24} sm={24} md={24} lg={24} >
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


                    <Button type="primary" form="variable-form" htmlType="submit" >{"Save"}</Button>
                </Form>
            </Modal>
            <Button onClick={() => setVisible(true)}  >Variable</Button>
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