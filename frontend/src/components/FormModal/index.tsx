import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Spin } from 'antd';

interface FieldType {
    name: string;
    label: string;
    inputType?: 'text' | 'textarea' | 'url';
    rules?: object[];
}

interface FormModalProps {
    title: string;
    open: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    fields: FieldType[];
    initialValues?: object; // Add this to accept initial values
    okText?: string; // Optional prop for OK button text
    cancelText?: string; // Optional prop for Cancel button text
    onGenerateText: () => Promise<string>; // Function to generate AI text
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
    onGenerateText,
}) => {
    const [form] = Form.useForm();
    const [isGenerating, setIsGenerating] = useState(false); // State to track AI generation status

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
            onSubmit(values);
            form.resetFields(); // Reset fields after successful submission
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleGenerateText = async () => {
        try {
            const values = await form.validateFields();
            console.log("value", values);
            setIsGenerating(true);
            const generatedText = await onGenerateText();
            form.setFieldsValue({ description: generatedText });
        } catch (error) {
            console.error('AI text generation failed:', error);
        } finally {
            setIsGenerating(false);
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
                    >
                        {field.inputType === 'textarea' ? (
                            <Input.TextArea />
                        ) : (
                            <Input type={field.inputType || 'text'} />
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
