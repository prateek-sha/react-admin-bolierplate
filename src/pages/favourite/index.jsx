import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Descriptions } from 'antd'
import moment from 'moment'
import { UserData } from '../../components/user'

export const FavouritePage = () => {

    const [data, setData] = useState([]);
    const [userID, setUserID] = useState(null)

    const allDataReducer = useSelector(state => state.allDataReducer)

    useEffect(() => {
        if (allDataReducer.favourite) {
            let res = allDataReducer.favourite;
            setData(res)
        }
    }, [allDataReducer.favourite])

    const columns = [
        {
            key: "userid",
            title: 'User ID',
            dataIndex: 'parentID',
            render: (id) => <p onClick={()=>setUserID(id)} >{id}</p>
        },
        {
            title: 'Date',
            dataIndex: 'created_on',
            render: (date) => <>{moment(date).format('Do MMMM YYYY')}</>
        }
    ];

    return (
        <div>
            <UserData id={userID} onCancel={() => setUserID(null)} />

            <Table
                dataSource={data}
                columns={columns}
                expandable={{
                    expandedRowRender: record => <ProductList record={record} />,
                }}
                rowClassName="editable-row"
            />
        </div>
    )
}

const ProductList = ({ record }) => {

    return (
        <div>
            <Descriptions
                title={null}
                bordered
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >{
                    record.favlistName.map(data =>
                        <Descriptions.Item label={data.name}>
                            {
                                data.children.map(product => <><p>{product}</p></>)
                            }
                        </Descriptions.Item>
                    )
                }
            </Descriptions>
        </div>
    )
}
