import '../../editor.css'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

import React, { useCallback } from 'react'
import {
    AiOutlineBold,
    AiOutlineItalic,
    AiOutlineStrikethrough,
    AiOutlineOrderedList,
    AiOutlineUnorderedList,
    AiOutlineUnderline,
    AiOutlineClear
} from 'react-icons/ai'
import { BsCode, BsCodeSquare, BsBlockquoteLeft, BsCardImage } from 'react-icons/bs'
import { MdOutlineHorizontalRule } from 'react-icons/md'
import { FaHeading } from 'react-icons/fa'
import { TbHeading, TbLink, TbUnlink } from 'react-icons/tb'

import { useStateContext } from '../../context/ContextProvider'

/**
 * Editor made using TipTap
 * Base code taken from documentation but has been adapted for Gaia
 * Images uploaded by user are compressed and converted to base64 for image analysis
 * @param {string} - setContent State variable binded to the page where the component is constructed. Content is passed back up to that page.
 * 
 * @returns {JSX.Element} A fully fledged editor 
 */
const MenuBar = ({ editor }) => {


    function resizeImage(file, maxSize) {
        return new Promise((resolve, reject) => {
            const img = document.createElement("img");
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height *= maxSize / width;
                        width = maxSize;
                    } else {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    const newFile = new File([blob], file.name, { type: file.type });
                    resolve(newFile);
                }, file.type);
            };
            img.onerror = () => {
                reject(new Error("Failed to load image"));
            };
            img.src = URL.createObjectURL(file);
        });
    }

    const addImage = async e => {
        const img = e.target.files[0]
        let imageRegEx = /(\.gif|\.jpg|\.png|\.bmp)$/
        let imageValid = imageRegEx.test(img.name)

        if (!imageValid) {
            return
        }

        const resizedImgFile = await resizeImage(img, 550);
        const fileReader = new FileReader()
        fileReader.readAsDataURL(resizedImgFile)

        await new Promise((resolve) => {
            fileReader.onload = () => {
                resolve()
            }
        })

        const base64Img = fileReader.result

        editor.chain().focus().setImage({ src: base64Img }).run()
    }

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()

            return
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url })
            .run()
    }, [editor])

    const clear = () => {
        var c = window.confirm(`Are you sure you want to clear?\nThis can't be undone`)
        if (c === 'true') {
            editor.commands.clearContent()
        }
        else {
            return
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className='flex pb-2'>
            <div className='justify-start'>
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()
                    }
                    className={editor.isActive('bold') ? 'is-active' : 'editor'}
                >
                    <AiOutlineBold size={'26px'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleItalic()
                            .run()
                    }
                    className={editor.isActive('italic') ? 'is-active' : 'editor'}
                >
                    <AiOutlineItalic size={'26px'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleUnderline()
                            .run()
                    }
                    className={editor.isActive('underline') ? 'is-active' : 'editor'}
                >
                    <AiOutlineUnderline size={'26px'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleStrike()
                            .run()
                    }
                    className={editor.isActive('strike') ? 'is-active' : 'editor'}
                >
                    <AiOutlineStrikethrough size={'26px'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'is-active' : 'editor'}
                >
                    <FaHeading size={'26px'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : 'editor'}
                >
                    <TbHeading size={'26px'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : 'editor'}
                >
                    <AiOutlineUnorderedList size={'26px'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'is-active' : 'editor'}
                >
                    <AiOutlineOrderedList size={'26px'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleCode()
                            .run()
                    }
                    className={editor.isActive('code') ? 'is-active' : 'editor'}
                >
                    <BsCode size={'26px'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'is-active' : 'editor'}
                >
                    <BsCodeSquare size={'26px'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'editor-is-active' : 'editor'}
                >
                    <BsBlockquoteLeft size={'26px'} />
                </button>
                <button onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className='editor'
                >
                    <MdOutlineHorizontalRule size={'26px'} />
                </button>
                {/* <button onClick={(event) => {
                    addImage()
                }
                }
                    className='editor'
                >
                    <BsCardImage size={'26px'} />
                </button> */}
                <input type='file' onChange={addImage} className='opacity-0 w-[40px] h-[50px] absolute cursor-pointer' />
                <button
                    className={'editor'}
                    onClick={(event) => {
                        addImage()
                    }}
                >

                    <BsCardImage size={'26px'} />
                </button>


                <button onClick={setLink} className={editor.isActive('link') ? 'is-active' : 'editor'}>
                    <TbLink size={'26px'} />
                </button>
                <button
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive('link')}
                    className='editor'
                >
                    <TbUnlink size={'26px'} />
                </button>
                <button className='editor' onClick={() => clear()}>
                    <AiOutlineClear size={'26px'} />
                </button>
            </div>
        </div>
    )
}

const Editor = ({ setContent, borderColor }) => {

    const { darkMode } = useStateContext()

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                emptyEditorClass: 'is-editor-empty',
                placeholder: 'Content'
            }),
            // LineBreak.extend({
            //     addKeyboardShortcuts() {
            //         return {
            //             Enter: () => this.editor.commands.setHardBreak()
            //         }
            //     }
            // }),
            Image,
            Link.configure({
                HTMLAttributes: {
                    class: ''
                }
            }),
        ],
        content: `
        
        `,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setContent(html + ' ')
        },
    })

    return (
        <>
            <div className={`border-4 rounded-lg ${borderColor === undefined ? 'border-light-orange dark:border-dark-orange' : borderColor} pt-5 pl-5 pr-5 bg-white`}>
                <div className='border-b-2 border-light-orange mb-5'>
                    <MenuBar editor={editor} />
                </div>
                <EditorContent editor={editor} />
            </div>
        </>
    )
}

export default Editor