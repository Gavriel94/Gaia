import '../editor.css'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import LineBreak from '@tiptap/extension-hard-break'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import React, { useCallback, useEffect, useState } from 'react'
import {
    AiOutlineBold,
    AiOutlineItalic,
    AiOutlineStrikethrough,
    AiOutlineOrderedList,
    AiOutlineUnorderedList,
    AiOutlineUnderline
} from 'react-icons/ai'
import { BsCode, BsCodeSquare, BsBlockquoteLeft, BsCardImage } from 'react-icons/bs'
import { MdOutlineHorizontalRule } from 'react-icons/md'
import { FaHeading } from 'react-icons/fa'
import { TbHeading, TbLink, TbUnlink } from 'react-icons/tb'
import Modal from 'react-modal'

import { useStateContext } from '../context/ContextProvider'

/**
 * TODO: Sanitise all HTML input 
 * @returns an editor component made using TipTap and extended for Gaia
 */

const MenuBar = ({ editor }) => {

    const addImage = () => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
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
                <button onClick={(event) => {
                    addImage()
                }
                }
                    className='editor'
                >
                    <BsCardImage size={'26px'} />
                </button>
                <button onClick={setLink} className={editor.isActive('link') ? 'is-active' : 'editor'}>
                    <TbLink size={'26px'}/>
                </button>
                <button
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    disabled={!editor.isActive('link')}
                    className='editor'
                >
                    <TbUnlink size={'26px'}/>
                </button>
            </div>
        </div>
    )
}

const Editor = ({ setContent }) => {

    const { darkMode } = useStateContext()

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                emptyEditorClass: 'is-editor-empty',
                placeholder: 'Content',
            }),
            LineBreak,
            // LineBreak.extend({
            //     addKeyboardShortcuts() {
            //         return {
            //             Enter: () => this.editor.commands.setHardBreak()
            //         }
            //     }
            // }),
            Image,
            BubbleMenu.configure({
                element: document.querySelector('.menu'),
                shouldShow: true,
            }),
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
            setContent(html)
        },
    })

    return (
        <>
            <div className='border-2 rounded-lg border-light-orange dark:border-dark-orange pt-5 pl-5 pr-5'>
            <div className='border-b-2 border-light-orange mb-5'>
                <MenuBar editor={editor} />
                </div>
                <EditorContent editor={editor} />
            </div>
        </>
    )
}

export default Editor