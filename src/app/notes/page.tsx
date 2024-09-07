"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Book,
  Edit,
  Hash,
  Image as LucideImage,
  Link as LucideLink,
  PenTool,
  Plus,
  Save,
  Search,
  Trash,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  tags: string[];
}

interface NoteSpace {
  id: string;
  name: string;
  notes: Note[];
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex space-x-2 mb-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          const url = window.prompt("URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={editor.isActive("link") ? "is-active" : ""}
      >
        <LucideLink className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          const url = window.prompt("Image URL");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      >
        <LucideImage className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        <Hash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function BookNotes() {
  const [noteSpaces, setNoteSpaces] = useState<NoteSpace[]>([]);
  const [activeSpace, setActiveSpace] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingSpace, setIsEditingSpace] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const savedSpaces = localStorage.getItem("bookNoteSpaces");
    if (savedSpaces) {
      setNoteSpaces(JSON.parse(savedSpaces));
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    localStorage.setItem("bookNoteSpaces", JSON.stringify(noteSpaces));
  }, [noteSpaces]);

  const editor = useEditor({
    extensions: [StarterKit, Image, Link],
    content: "",
    onUpdate: ({ editor }) => {
      if (activeNote) {
        updateNote(activeNote, activeNoteData?.title || "", editor.getHTML());
      }
    },
  });

  const activeNoteData =
    activeSpace && activeNote
      ? noteSpaces
          .find((space) => space.id === activeSpace)
          ?.notes.find((note) => note.id === activeNote)
      : null;

  useEffect(() => {
    if (editor && activeNoteData) {
      editor.commands.setContent(activeNoteData.content);
    }
  }, [activeNote, activeNoteData, editor]);

  const createNoteSpace = () => {
    const newSpace: NoteSpace = {
      id: uuidv4(),
      name: "Новое пространство",
      notes: [],
    };
    setNoteSpaces([...noteSpaces, newSpace]);
    setActiveSpace(newSpace.id);
    setIsEditingSpace(true);
    setNewSpaceName("Новое пространство");
  };

  const updateNoteSpace = () => {
    setNoteSpaces(
      noteSpaces.map((space) =>
        space.id === activeSpace ? { ...space, name: newSpaceName } : space
      )
    );
    setIsEditingSpace(false);
    toast.success("Пространство для заметок обновлено!");
  };

  const deleteNoteSpace = (spaceId: string) => {
    setNoteSpaces(noteSpaces.filter((space) => space.id !== spaceId));
    if (activeSpace === spaceId) {
      setActiveSpace(null);
      setActiveNote(null);
    }
    toast.info("Пространство для заметок удалено");
  };

  const createNote = () => {
    const newNote: Note = {
      id: uuidv4(),
      title: "Новая заметка",
      content: "",
      lastModified: Date.now(),
      tags: [],
    };
    setNoteSpaces(
      noteSpaces.map((space) =>
        space.id === activeSpace
          ? { ...space, notes: [...space.notes, newNote] }
          : space
      )
    );
    setActiveNote(newNote.id);
  };

  const updateNote = useCallback(
    (noteId: string, title: string, content: string) => {
      setNoteSpaces(
        noteSpaces.map((space) =>
          space.id === activeSpace
            ? {
                ...space,
                notes: space.notes.map((note) =>
                  note.id === noteId
                    ? { ...note, title, content, lastModified: Date.now() }
                    : note
                ),
              }
            : space
        )
      );
    },
    [noteSpaces, activeSpace]
  );

  const deleteNote = (noteId: string) => {
    setNoteSpaces(
      noteSpaces.map((space) =>
        space.id === activeSpace
          ? {
              ...space,
              notes: space.notes.filter((note) => note.id !== noteId),
            }
          : space
      )
    );
    if (activeNote === noteId) {
      setActiveNote(null);
    }
    toast.info("Заметка удалена");
  };

  const addTag = () => {
    if (newTag && !currentTags.includes(newTag)) {
      setCurrentTags([...currentTags, newTag]);
      setNewTag("");

      if (activeNote) {
        setNoteSpaces(
          noteSpaces.map((space) =>
            space.id === activeSpace
              ? {
                  ...space,
                  notes: space.notes.map((note) =>
                    note.id === activeNote
                      ? { ...note, tags: [...note.tags, newTag] }
                      : note
                  ),
                }
              : space
          )
        );
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter((tag) => tag !== tagToRemove));

    if (activeNote) {
      setNoteSpaces(
        noteSpaces.map((space) =>
          space.id === activeSpace
            ? {
                ...space,
                notes: space.notes.map((note) =>
                  note.id === activeNote
                    ? {
                        ...note,
                        tags: note.tags.filter((tag) => tag !== tagToRemove),
                      }
                    : note
                ),
              }
            : space
        )
      );
    }
  };

  const filteredNotes = activeSpace
    ? noteSpaces
        .find((space) => space.id === activeSpace)
        ?.notes.filter(
          (note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Заметки по книгам</h1>
      <div className={`flex flex-col ${isMobile ? "" : "md:flex-row"} gap-6`}>
        <Card className={`w-full ${isMobile ? "" : "md:w-1/4"}`}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Пространства
              <Button variant="outline" size="icon" onClick={createNoteSpace}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-screen">
              {" "}
              {/* Устанавливаем высоту для ScrollArea */}
              <Tabs
                value={activeSpace || undefined}
                onValueChange={setActiveSpace}
              >
                <TabsList className="flex flex-col items-stretch">
                  {noteSpaces.map((space) => (
                    <TabsTrigger
                      key={space.id}
                      value={space.id}
                      className="justify-between"
                    >
                      {isEditingSpace && activeSpace === space.id ? (
                        <Input
                          value={newSpaceName}
                          onChange={(e) => setNewSpaceName(e.target.value)}
                          onBlur={updateNoteSpace}
                          onKeyPress={(e) =>
                            e.key === "Enter" && updateNoteSpace()
                          }
                          className="w-full"
                        />
                      ) : (
                        <>
                          {space.name}
                          <div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setIsEditingSpace(true);
                                setNewSpaceName(space.name);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteNoteSpace(space.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </ScrollArea>
          </CardContent>
        </Card>

        {activeSpace && (
          <Card className={`w-full ${isMobile ? "" : "md:w-3/4"}`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Заметки
                <div className="flex gap-2">
                  <Input
                    placeholder="Поиск заметок..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="icon" onClick={createNote}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex ${isMobile ? "flex-col" : ""} gap-6`}>
                <ScrollArea
                  className={`${
                    isMobile ? "h-[200px]" : "h-[calc(100vh-300px)]"
                  } ${isMobile ? "w-full" : "w-1/3"}`}
                >
                  {filteredNotes?.map((note) => (
                    <Card
                      key={note.id}
                      className="mb-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => setActiveNote(note.id)}
                    >
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          {note.title}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNote(note.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-2">
                          {new Date(note.lastModified).toLocaleString()}
                        </p>
                        <div
                          className="line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
                {activeNoteData && (
                  <div className={`${isMobile ? "w-full" : "w-2/3"}`}>
                    <Input
                      value={activeNoteData.title}
                      onChange={(e) =>
                        updateNote(
                          activeNoteData.id,
                          e.target.value,
                          activeNoteData.content
                        )
                      }
                      className="mb-4"
                    />
                    <MenuBar editor={editor} />
                    <EditorContent
                      editor={editor}
                      className="prose max-w-none mb-4 p-4 border rounded-md w-full min-h-[300px] cursor-text"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {activeNoteData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 text-gray-500"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                      <Dialog
                        open={showTagDialog}
                        onOpenChange={setShowTagDialog}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline">Добавить тег</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <DialogHeader>
                            <DialogTitle>Добавить новый тег</DialogTitle>
                          </DialogHeader>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Введите новый тег"
                            />
                            <Button onClick={addTag}>Добавить</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
