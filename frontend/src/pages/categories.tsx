import React, { useState, useEffect } from 'react';
import { Button, message, Space, Modal } from 'antd';
import api from '@/services/api';
import DataTable from '@/components/Table';
import EntityModal from '@/components/EntityModal';
import PreviewModal from '@/components/PreviewModal';
import { BsPencilSquare, BsEyeFill, BsTrash3Fill } from "react-icons/bs";

interface DataType {
    key: string;
    name: string;
    description: string;
    jobCount: number;
}

const CategoriesPage: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
    const [editingData, setEditingData] = useState<DataType | null>(null);
    const [previewData, setPreviewData] = useState<DataType | null>(null);

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            const fetchedData = response.data.results.map((item: any) => ({
                key: item._id,
                name: item.name,
                description: item.description,
                jobCount: item.jobCount,
            }));
            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Failed to fetch categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle Add or Edit Category
    const handleAddOrEditCategory = async (values: any) => {
        if (editingData) {
            try {
                await api.put(`/categories/${editingData.key}`, values);
                setData((prevData) =>
                    prevData.map((item) =>
                        item.key === editingData.key
                            ? { ...item, ...values }
                            : item
                    )
                );
                message.success('Category updated successfully.');
            } catch (error) {
                console.error('Error updating category:', error);
                message.error('Failed to update category.');
            }
        } else {
            try {
                const response = await api.post('/categories', values);
                setData((prevData) => [
                    ...prevData,
                    {
                        key: response.data._id,
                        name: response.data.name,
                        description: response.data.description,
                        jobCount: response.data.jobCount,
                    },
                ]);
                message.success('Category added successfully.');
            } catch (error) {
                console.error('Error adding category:', error);
                message.error('Failed to add category.');
            }
        }
        setIsModalVisible(false);
        setEditingData(null);
    };

    // Show confirmation before delete
    const showDeleteConfirm = (key: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this category?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk: () => handleDeleteCategory(key),
        });
    };

    // Handle delete category
    const handleDeleteCategory = async (key: string) => {
        try {
            await api.delete(`/categories/${key}`);
            setData((prevData) => prevData.filter((item) => item.key !== key));
            message.success('Category deleted successfully.');
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Failed to delete category.');
        }
    };

    // Define columns for the table
    const columns = [
        {
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '35%',
        },
        {
            title: 'Jobs',
            dataIndex: 'jobCount',
            key: 'jobCount',
            width: '10%',
            sorter: (a: any, b: any) => a.jobCount - b.jobCount,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: DataType) => (
                <Space>
                    <Button
                        type="default"
                        className='bg-green-600 text-white hover:!bg-green-500 hover:!text-white !border-none'
                        onClick={() => {
                            setEditingData(record);
                            setIsModalVisible(true);
                        }}
                    >
                        <BsPencilSquare />
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setPreviewData(record);
                            setIsPreviewVisible(true);
                        }}
                    >
                        <BsEyeFill />
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() => showDeleteConfirm(record.key)}
                    >
                        <BsTrash3Fill />
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setIsModalVisible(true);
                    setEditingData(null);
                }}
            >
                Add Category
            </Button>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable<DataType> data={data} columns={columns} />
            )}
            <EntityModal
                title="Create or Edit Category"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleAddOrEditCategory}
                fields={[
                    {
                        name: 'name',
                        label: 'Category Name',
                        inputType: 'text',
                        rules: [{ required: true, message: 'Please enter the category name' }],
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        inputType: 'textarea',
                        rules: [{ message: 'Please enter a description', }],
                    },
                ]}
                initialValues={editingData || { name: '', description: '' }}
                okText="Save"
                cancelText="Cancel"
                entityType={"category"}
            />
            <PreviewModal
                title="Category Details"
                open={isPreviewVisible}
                onCancel={() => setIsPreviewVisible(false)}
                fields={[
                    {
                        name: 'name',
                        label: 'Name'
                    },
                    {
                        name: 'description',
                        label: 'Description'
                    },
                    {
                        name: 'jobCount',
                        label: 'Total Jobs'
                    },
                ]}
                data={previewData || {}}
            />
        </div>
    );
};

export default CategoriesPage;
