import React, { useEffect, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Spin,
    Select,
    Checkbox,
    Upload,
    Radio,
    message,
} from 'antd';
import { generateDescription } from '@/services/aiService';
import { UploadOutlined } from '@ant-design/icons';
import store from '@/store';


interface OptionType {
    value: string | number;
    label: string;
}

interface FieldType {
    name: string;
    label: string;
    inputType?: 'text' | 'textarea' | 'password' | 'dropdown' | 'checkbox' | 'fileupload' | 'radio';
    placeholder?: string;
    rules?: object[];
    options?: OptionType[];
    uploadAction?: string; // For file upload
    accept?: string; // Accepted file types
    listType?: 'text' | 'picture' | 'picture-card'; // Upload list type
    uploadButtonText?: string; // Button text for upload
}

interface FormModalProps {
    title: string;
    open: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    fields: FieldType[];
    initialValues?: object;
    okText?: string;
    cancelText?: string;
    entityType: string;
}

const FormModal: React.FC<FormModalProps> = ({
    title,
    open,
    onCancel,
    onSubmit,
    fields,
    initialValues,
    okText = 'Save',
    cancelText = 'Cancel',
    entityType,
}) => {
    const [form] = Form.useForm();
    const [isGenerating, setIsGenerating] = useState(false);
    const state = store.getState();
    const token = state.auth.token;

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues); // Set form values when initialValues change
        } else {
            form.resetFields(); // Reset fields when there are no initial values
        }
    }, [initialValues, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);

            onSubmit(values);
            form.resetFields(); // Reset fields after successful submission
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleGenerateText = async () => {
        try {
            const values = await form.validateFields();
            setIsGenerating(true);
            const generatedText = await generateDescription(values, entityType);
            form.setFieldsValue({ description: generatedText });
        } catch (error) {
            console.error('AI text generation failed:', error);
            message.error('Failed to generate description. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUploadChange = (info: any, fieldName: string) => {
        const { file } = info;
        if (file.status === 'done') {
            message.success(`${file.name} file uploaded successfully.`);
            form.setFieldsValue({ [fieldName]: file.response.url });
        } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`);

        }
    };

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            onOk={handleOk}
            okText={okText}
            cancelText={cancelText}
        >
            <Form form={form} layout="vertical">
                {fields.map((field) => (
                    <Form.Item
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        rules={field.rules}
                        valuePropName={field.inputType === 'fileupload' ? 'fileList' : undefined}
                        getValueFromEvent={
                            field.inputType === 'fileupload'
                                ? (e) => (Array.isArray(e) ? e : e?.fileList)
                                : undefined
                        }
                    >
                        {field.inputType === 'textarea' && (
                            <Input.TextArea rows={8} placeholder={field.placeholder || ''} />
                        )}
                        {field.inputType === 'text' && (
                            <Input type="text" placeholder={field.placeholder || ''} />
                        )}
                        {field.inputType === 'password' && (
                            <Input.Password placeholder={field.placeholder || ''} />
                        )}
                        {field.inputType === 'dropdown' && (
                            <Select placeholder={field.placeholder || 'Select an option'}>
                                {field.options?.map((option) => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                        {field.inputType === 'checkbox' && <Checkbox>{field.label}</Checkbox>}
                        {field.inputType === 'fileupload' && (
                            <Upload
                                name="file"
                                action={`${import.meta.env.VITE_API_URL}/api/midea${field.uploadAction}`}
                                headers={
                                    { Authorization: `Bearer ${token}`, }
                                }
                                listType={field.listType || 'text'}
                                accept={field.accept}
                                onChange={(info) => handleUploadChange(info, field.name)}
                            >
                                <Button icon={<UploadOutlined />}>
                                    {field.uploadButtonText || 'Upload File'}
                                </Button>
                            </Upload>
                        )}
                        {field.inputType === 'radio' && (
                            <Radio.Group>
                                {field.options?.map((option) => (
                                    <Radio key={option.value} value={option.value}>
                                        {option.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        )}
                    </Form.Item>
                ))}

                {/* AI Text Generation Button */}
                <Form.Item>
                    <Button
                        type="primary"
                        onClick={handleGenerateText}
                        loading={isGenerating}
                        disabled={isGenerating}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Description'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FormModal;
