import React, { useState, useEffect } from 'react';
import { Table, Input, Form, Modal, Button,Space, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { setParent } from '../../elements/api/product';
import { useDispatch, useSelector } from 'react-redux';
import { setParentAction } from '../../redux/actions/allData';
import { responseHelper } from '../../lib/response';
import { SearchableTable } from '../../lib/serach';

export const MainCategoryPanel = () => {
	const [data, setData] = useState([]);
	const [visible, setVisible] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [selectedID, setSelectedID] = useState(null)

	const [form] = Form.useForm()
	const allDataReducer = useSelector(state => state.allDataReducer)

	const dispatch = useDispatch()
	const refresh = () => dispatch(setParentAction())
	
	useEffect(() => { 
		if(allDataReducer.parent){
			let res = allDataReducer.parent;
			setData(res)
		}
	}, [allDataReducer.parent])
	

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			sorter: (a, b) => a.id - b.id,
			key:"id"
		},
		{
			title: 'Name',
			key:'name',
			dataIndex: 'name',
		},
		{
			title:'Action',
			key:'action',
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
		responseHelper(res, refresh);
	}

	useEffect(()=>{
		if(selectedID !== null){
			setVisible(true)
			setIsEdit(true)
			let formValue = data.filter(({id}) => id === selectedID )[0]
			form.setFieldsValue({...formValue})
		}
	},[selectedID])

	const handleOk = async ({name}) => {
		if (isEdit) {
			let res = await setParent({ name, id:selectedID,  action: "UPDATE" })
			responseHelper(res, refresh);
		} else {
			let res = await setParent({ name, action: "INSERT" })
			responseHelper(res, refresh);
		}
		onCancel()
	}

	const onCancel = () => {
		setVisible(false);
		setIsEdit(false);
		setSelectedID(null);
		form.resetFields()
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
					<Form.Item rules={[{required:true, message:"This is required" }]} label="Category Name" name="name"  rules={[{required:true , message:'this is required'}]} >
						<Input />
					</Form.Item>
					<Button type="primary"  htmlType="submit" >{isEdit ? "Edit" : "Save"}</Button>
				</Form>
			</Modal>
			<Button onClick={() => setVisible(true)} icon={<PlusOutlined />} type="primary" >Add</Button><br />
			<br />
			<SearchableTable
			id="main"
				dataSource={data}
				columns={columns}
				rowClassName="editable-row"
			/>
		</div>
	);
};

