import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setOrderAction } from '../../redux/actions/allData';
import { Table, Button, Space, Modal, Input, InputNumber, Form, Col, Row } from 'antd'
import { getUser, setOrder, setQuote } from '../../elements/api/other';
import { responseHelper } from '../../lib/response';
import moment from 'moment'
import { Select } from 'antd';
import { toast } from 'react-toastify';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { UserData } from '../../components/user';
const { Item } = Form


export const OrderPage = () => {

    const [data, setData] = useState([]);
    const [selectedID, setSelectedID] = useState(null);
    const [modalVisible, setModalVisible] = useState(false)
    const [form] = Form.useForm()
    const [userID, setUserID] = useState(null)

    const allDataReducer = useSelector(state => state.allDataReducer)

    const dispatch = useDispatch()
    const refresh = () => {
        setModalVisible(false)
        handleCancel()
        dispatch(setOrderAction())

    }

    useEffect(() => {
        if (allDataReducer.order) {
            let res = allDataReducer.order;
            setData(res)
        } else dispatch(setOrderAction())
    }, [allDataReducer.order])


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            editable: false,
        },
        {
            title: 'User ID',
            dataIndex: 'userID',
            editable: true,
            render: (id) => <p onClick={() => setUserID(id)} >{id}</p>

        },
        {
            title: 'Product ID',
            dataIndex: 'productID',
            editable: true,
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            editable: true,
        },
        {
            title: 'Accpeted',
            dataIndex: 'accpet',
            render: (data) => <div>{data === "0" ? "Pending" : "Accpeted"}</div>

        },
        {
            title: 'Order Status',
            dataIndex: 'orderStatus',
            editable: true,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
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
            render: (data) => <Space>
                <Button type="primary" onClick={() => setSelectedID(data.id)} >Edit</Button>
                <Button type="primary" danger onClick={() => handleDelete(data.id)} >Delete</Button>
            </Space>
        }
    ];
    const handleDelete = async (id) => {
        let res = await setOrder({ id, action: "DELETE" });
        responseHelper(res, refresh);
    }

    const handleUpdate = async (value) => {
        let productID = value.product.map(data => data.product).join(',')
        let price = value.product.map(data => data.price).join(',')
        let quantity = value.product.map(data => data.quantity).join(',')
        let formValue = data.filter(({ id }) => id === selectedID)[0]
        value.track = JSON.stringify(value.track)
        let res = await setOrder({ id: selectedID, ...formValue, ...value, quantity, price, productID, action: "UPDATE" })
        responseHelper(res, refresh);
    }


    function isString(obj) {
        return obj !== undefined && obj !== null && obj.constructor == String;
    }

    useEffect(() => {
        if (selectedID !== null) {
            setModalVisible(true)
            let formValue = data.filter(({ id }) => id === selectedID)[0]
            if (formValue.track && isString(formValue.track)) {
                formValue.track = formValue.track.replace(/\\n/g, "\\n")
                    .replace(/\\'/g, "\\'")
                    .replace(/\\"/g, '\\"')
                    .replace(/\\&/g, "\\&")
                    .replace(/\\r/g, "\\r")
                    .replace(/\\t/g, "\\t")
                    .replace(/\\b/g, "\\b")
                    .replace(/\\f/g, "\\f");
                // remove non-printable and other non-valid JformValue.trackON charformValue.track
                formValue.track = formValue.track.replace(/[\u0000-\u0019]+/g, "");
                formValue.track = JSON.parse(formValue.track)
            }
            let productid = formValue.productID.split(',')
            let price = formValue.price.split(',')
            let quantity = formValue.quantity.split(',');
            let product = [];
            for (let i = 0; i < productid.length; i++) {
                product.push({
                    product: productid[i],
                    price: price[i],
                    quantity: quantity[i]
                })
            }
            form.setFieldsValue({ ...formValue, product })
        }
    }, [selectedID])

    const handleCancel = () => {
        form.resetFields()
        setSelectedID(null)
        setModalVisible(false);
    }

    return (
        <div>
            <UserData id={userID} onCancel={() => setUserID(null)} />
            <Modal
                title="Order"
                visible={modalVisible}
                onCancel={handleCancel}
                footer={null}
                width="69vw"
            >
                <Form form={form} onFinish={handleUpdate} >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={24} >
                            <Item name="paymentStatus" label="Payment Status" >
                                <Select>
                                    <Select.Option value="pending" >Pending</Select.Option>
                                    <Select.Option value={"done"} >Done</Select.Option>
                                </Select>
                            </Item>
                        </Col >
                        <Col xs={24} sm={24} md={24} lg={24} >
                            <Item name="orderStatus" label="Order Status" >
                                <Select>
                                    <Select.Option value="active"> Active</Select.Option>
                                    <Select.Option value="canceled" >Canceled</Select.Option>
                                </Select>
                            </Item>
                        </Col >
                        <Col xs={24} sm={24} md={24} lg={24} >
                            <Item name="priceSection" label="Price Type" >
                                <Select>
                                    <Select.Option value="dollar"> Dollar</Select.Option>
                                    <Select.Option value="ruppe" >Ruppe</Select.Option>
                                </Select>
                            </Item>
                        </Col >
                        <Col xs={24} sm={24} md={24} lg={24} >
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
                                                        {allDataReducer.product && allDataReducer.product.map(productData =>
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
                        </Col >
                        <Col xs={24} sm={24} md={24} lg={24} >
                            <Form.List name="track">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'location']}
                                                    fieldKey={[fieldKey, 'location']}
                                                    rules={[{ required: true, message: 'Missing Feature' }]}
                                                >
                                                    <Input placeholder="location" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'status']}
                                                    fieldKey={[fieldKey, 'status']}
                                                    rules={[{ required: true, message: 'Missing status' }]}
                                                >
                                                    <Input placeholder="status.." />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Add Track
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Col>
                    </Row>
                    <Button htmlType="submit" >
                        Edit
                    </Button>
                </Form>
            </Modal>
            <Table
                dataSource={data}
                columns={columns}
                rowClassName="editable-row"
            />
        </div>
    )
}
