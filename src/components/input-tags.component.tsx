import {RepositoryId} from "../domain.ts";
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
        if (inputValue && !values.includes(inputValue)) {
            onChange([...values, inputValue]);
        }
        setInputValue('');
    };

    return <>
        <Flex wrap>
            {values.map(repositoryId => <Tag
                style={{
                    marginBottom: token.marginXXS,
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    fontSize: `${token.fontSizeLG * 0.8}px`,
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    padding: `${token.paddingXXS}px ${token.paddingXS}px`
                }}
                key={repositoryId}
                closable={true}
                onClose={() => {
                    handleRemove(repositoryId);
                }}>
                {repositoryId}
            </Tag>)}
        </Flex>
        <Input type="text"
               placeholder={placeholder}
               value={inputValue}
               onChange={handleInputChange}
               onBlur={handleInputConfirm}
               onPressEnter={handleInputConfirm}
        />
    </>
}
