import {RepositoryId} from "../../domain.ts";
import {Flex, Input, Tag, theme} from "antd";
import {ChangeEvent, useState} from "react";

interface Props {
    values: string[]
    onChange: (values: string[]) => void
    placeholder: string
}

export function InputTags({values, onChange, placeholder}: Props) {
    const {token} = theme.useToken();
    const [inputValue, setInputValue] = useState('');

    const handleRemove = (repositoryId: RepositoryId): void => {
        onChange(values.filter((v) => v !== repositoryId))
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        const inputValues = (inputValue || '')
            .trim()
            .split(/[\s,]+/)
            // trim resulting values
            .map(newValue => (newValue || '').trim())
            // filter empty values
            .filter(newValue => newValue != '');
            // remove duplicates
        const newValues = [...new Set(inputValues)]
            // filter already present
            .filter(newValue => !values.includes(newValue))
        onChange([...values, ...newValues]);
        setInputValue('');
    };

    return <>
        <Input type="text"
               placeholder={placeholder}
               value={inputValue}
               onChange={handleInputChange}
               onBlur={handleInputConfirm}
               onPressEnter={handleInputConfirm}
        />
        <Flex wrap>
            {values.map(repositoryId => <Tag
                style={{
                    marginBottom: token.marginXXS,
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    fontSize: `${token.fontSizeLG * 0.8}px`,
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    padding: `${token.paddingXXS}px ${token.paddingXS}px`
                }}
                color="blue"
                key={repositoryId}
                closable={true}
                onClose={() => {
                    handleRemove(repositoryId);
                }}>
                {repositoryId}
            </Tag>)}
        </Flex>
    </>
}
