import '../editor.css'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import LineBreak from '@tiptap/extension-hard-break'
import React, { useState } from 'react'
import {
    AiOutlineBold,
    AiOutlineItalic,
    AiOutlineStrikethrough,
    AiOutlineOrderedList,
    AiOutlineUnorderedList,
    AiOutlineUndo,
    AiOutlineRedo,
    AiOutlineUnderline
} from 'react-icons/ai'
import { BsCode, BsCodeSquare, BsBlockquoteLeft } from 'react-icons/bs'
import { MdOutlineHorizontalRule } from 'react-icons/md'
import { FaHeading } from 'react-icons/fa'
import { TbHeading } from 'react-icons/tb'

const MenuBar = ({ editor }) => {

    const [isActive, setUseActive] = useState(false)

    if (!editor) {
        return null
    }

    return (
        <div className='flex pb-10'>
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
                            .toggleItalic()
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
            </div>
        </div>
    )
}

const Editor = ({setContent}) => {
    const editor = useEditor({
        extensions: [
            StarterKit, 
            Underline, 
            Placeholder.configure({
                emptyEditorClass: 'is-editor-empty',
                placeholder: 'Content'
            }),
            LineBreak.extend({
                addKeyboardShortcuts () {
                  return {
                    Enter: () => this.editor.commands.setHardBreak()
                  }
                }
              })
        ],
        content: '',
    onUpdate: ({editor}) => {
        const html = editor.getHTML();
        setContent(html)
    },
    })

    return (
        <div className='border-2 rounded-lg border-light-orange dark:border-dark-orange p-5'>
            <MenuBar editor={editor} />
            <div className='border rounded-lg border-light-orange dark:border-dark-orange p-5'>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default Editor