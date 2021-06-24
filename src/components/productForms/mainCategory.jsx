import React, { useState } from 'react';
import { Table, Input, Form, Modal, Button,Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { setParent } from '../../elements/api/product';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setParentAction } from '../../redux/actions/product';

export const MainCategoryPanel = () => {
	const [data, setData] = useState([]);
	const [name, setName] = useState('');
	const [visible, setVisible] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [selectedID, setSelectedID] = useState(null)

	const dispatch = useDispatch()

	const [form] = Form.useForm()

	const productReducer = useSelector(state => state.productReducer)
	
	useEffect(() => { 
		if(productReducer.parent.length){
			let res = productReducer.parent;
			setData(res)
		}
	}, [productReducer.parent])
	

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			editable: false,
		},
		{
			title: 'Name',
			dataIndex: 'name',
			editable: true,
		},
		{
			title:'Action',
			render:(data)=><Space>
                <Button  type="primary" onClick={()=>setSelectedID(data.id)}>Edit</Button>
				<Popconfirm  title="Are you sure you want to delete this?" onConfirm={ () => handleDelete(data.id)} >
                	<Button type="primary" danger >Delete</Button>
				</Popconfirm>
            </Space>
		}
	];

	const handleDelete = async (id) => {
		let res = await setParent({id, action:"DELETE"});
		if(res.status !== "0"){
			dispatch(setParentAction());
			toast.success(res.msg);
		}else 
			toast.error(res.msg);
	}

	useEffect(()=>{
		if(selectedID !== null){
			setVisible(true)
			setIsEdit(true)
			let formValue = data.filter(({id}) => id === selectedID )[0]
			console.log(formValue)
			form.setFieldsValue({...formValue})
		}
	},[selectedID])

	const handleOk = async () => {
		if (isEdit) {

		} else {
			if (name === '') {
				toast.error("It cannot be empty");
				return;
			}
			let res = await setParent({ name, action: "INSERT" })
			console.log(res)
		}
	}

	const onCancel = () => {
		setVisible(false);
		setSelectedID(null);
	}

	return (
		<div>
			<Modal
				visible={visible}
				title={isEdit ? "Edit Category" : "Add New Category"}
				footer={null}
				onCancel={onCancel}
			>
				<Form form={form} layout="vertical" onFinish={handleOk}>
					<Form.Item label="Category Name" name="name">
						<Input />
					</Form.Item>
					<Button type="primary"  htmlType="submit" >{isEdit ? "Edit" : "Save"}</Button>
				</Form>
			</Modal>
			<Button onClick={() => setVisible(true)} icon={<PlusOutlined />} type="primary" >Add</Button><br />
			<br />
			<Form form={form} component={false}>
				<Table
					dataSource={data}
					columns={columns}
					rowClassName="editable-row"
				/>
			</Form>
		</div>
	);
};

