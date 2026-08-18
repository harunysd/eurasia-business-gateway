'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Icon, iconNames } from './Icon';
import { locales, type Locale } from '@/i18n/routing';

type Path = (string | number)[];

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  tr: 'TR',
  ru: 'RU',
};

// Heuristic: a key refers to an image asset.
function isImageKey(key: string): boolean {
  return /image/i.test(key);
}

// Heuristic: a string field should render as a textarea instead of a single
// line input. Long values or keys that imply prose get a textarea.
function isLongText(key: string, value: string): boolean {
  if (value && value.length > 70) return true;
  return /paragraph|description|subtitle|message|paragraphs/i.test(key);
}

// Turn a camelCase / snake-ish key into a readable label.
function prettyLabel(key: string | number): string {
  return String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

// Get the value at a path (indexing arrays by number, objects by key).
function getAtPath(root: unknown, path: Path): unknown {
  let node: unknown = root;
  for (const seg of path) {
    if (node == null) return undefined;
    if (typeof seg === 'number' && Array.isArray(node)) {
      node = node[seg];
    } else if (typeof seg === 'string' && typeof node === 'object') {
      node = (node as Record<string, unknown>)[seg];
    } else {
      return undefined;
    }
  }
  return node;
}

// Immutably set a value at a path inside a nested object/array.
function setAtPath(root: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (typeof head === 'number') {
    const arr = Array.isArray(root) ? [...root] : [];
    arr[head] = setAtPath(arr[head] ?? null, rest, value);
    return arr;
  }
  const obj = (root && typeof root === 'object' ? root : {}) as Record<
    string,
    unknown
  >;
  return { ...obj, [head]: setAtPath(obj[head], rest, value) };
}

function uniqueId(): string {
  return `item-${Date.now().toString(36)}${Math.floor(Math.random() * 36)
    .toString(36)}`;
}

// Build a blank template of the same shape as `sample`, used when adding a
// new item to a repeatable array. The `id` field always gets a fresh value.
function makeTemplate(sample: unknown): unknown {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(sample)) {
      out[k] = k === 'id' ? uniqueId() : makeTemplate(v);
    }
    return out;
  }
  if (typeof sample === 'string') return '';
  if (typeof sample === 'boolean') return false;
  if (typeof sample === 'number') return 0;
  return null;
}

// Extract a human label for an array item (its `id`, or a #N fallback).
function itemLabel(item: unknown, index: number): string {
  if (item && typeof item === 'object' && 'id' in item) {
    return String((item as Record<string, unknown>).id);
  }
  return `Öğe #${index + 1}`;
}

export function PageEditor({
  page,
  activeLocale,
  initialContent,
}: {
  page: string;
  activeLocale: Locale;
  initialContent: Record<string, unknown>;
}) {
  const [content, setContent] = useState<Record<string, unknown>>(initialContent);
  const [locale, setLocale] = useState<Locale>(activeLocale);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [uploadingPath, setUploadingPath] = useState<Path | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const currentData = content[locale] as Record<string, unknown>;
  const previewHref =
    page === 'home' ? `/${locale}` : `/${locale}/${page}`;

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    window.setTimeout(() => setToast(null), 3000);
  };

  const updateField = (path: Path, value: unknown) => {
    setContent((prev) => ({
      ...prev,
      [locale]: setAtPath(prev[locale], path, value),
    }));
  };

  const removeArrayItem = (path: Path, index: number) => {
    const arr = getAtPath(currentData, path);
    if (!Array.isArray(arr)) return;
    if (!window.confirm('Bu öğe silinsin mi? Bu işlem geri alınamaz.')) return;
    const next = [...arr];
    next.splice(index, 1);
    updateField(path, next);
  };

  const addArrayItem = (path: Path) => {
    const arr = getAtPath(currentData, path);
    if (!Array.isArray(arr)) return;
    const sample = arr[0] ?? {};
    updateField(path, [...arr, makeTemplate(sample)]);
  };

  const moveArrayItem = (path: Path, index: number, delta: number) => {
    const arr = getAtPath(currentData, path);
    if (!Array.isArray(arr)) return;
    const target = index + delta;
    if (target < 0 || target >= arr.length) return;
    const next = [...arr];
    [next[index], next[target]] = [next[target], next[index]];
    updateField(path, next);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${page}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, data: content[locale] }),
      });
      if (!res.ok) throw new Error('save failed');
      showToast('success', `${localeLabels[locale]} içerik kaydedildi.`);
    } catch {
      showToast('error', 'Kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (path: Path, file: File) => {
    setUploadingPath(path);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('upload failed');
      const { path: returnedPath } = (await res.json()) as { path: string };
      updateField(path, returnedPath);
      showToast('success', 'Görsel güncellendi.');
    } catch {
      showToast('error', 'Görsel yüklenemedi.');
    } finally {
      setUploadingPath(null);
    }
  };

  const pathKey = (p: Path) => p.join('.');

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-tight text-navy">
            Düzenle: {page.replace(/-/g, ' ')}
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray">
            İçerik Yönetimi
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded border-2 border-navy px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-navy transition-colors hover:bg-navy hover:text-white"
          >
            <Icon name="Eye" className="h-4 w-4" />
            Önizle
          </a>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded bg-teal px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-navy disabled:opacity-70"
          >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Kaydediliyor...
                </>
              ) : (
                'Değişiklikleri Kaydet'
              )}
          </button>
        </div>
      </div>

      {/* Language tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray/20">
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
              l === locale
                ? 'border-teal text-teal'
                : 'border-transparent text-gray hover:text-navy'
            }`}
          >
            {localeLabels[l]}
          </button>
        ))}
      </div>

      {/* Dynamic form */}
      <div className="space-y-6">
        <FormNode
          data={currentData}
          path={[]}
          label={null}
          onFieldChange={updateField}
          onUpload={onUpload}
          onArrayRemove={removeArrayItem}
          onArrayAdd={addArrayItem}
          onArrayMove={moveArrayItem}
          uploadingPath={uploadingPath}
          fileRefs={fileRefs}
          pathKey={pathKey}
        />
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-5 py-3 text-sm font-medium shadow-lg ${
            toast.type === 'success'
              ? 'bg-teal text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// Recursive form renderer. Walks the JSON structure and emits the right
// control for each leaf, and nested sections for objects/arrays. Arrays get
// add / remove / reorder controls; `icon` fields get a visual picker.
function FormNode({
  data,
  path,
  label,
  onFieldChange,
  onUpload,
  onArrayRemove,
  onArrayAdd,
  onArrayMove,
  uploadingPath,
  fileRefs,
  pathKey,
}: {
  data: unknown;
  path: Path;
  label: string | null;
  onFieldChange: (path: Path, value: unknown) => void;
  onUpload: (path: Path, file: File) => void;
  onArrayRemove: (path: Path, index: number) => void;
  onArrayAdd: (path: Path) => void;
  onArrayMove: (path: Path, index: number, delta: number) => void;
  uploadingPath: Path | null;
  fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  pathKey: (p: Path) => string;
}) {
  // Array → render each item with add / remove / reorder controls.
  if (Array.isArray(data)) {
    return (
      <ArrayNode
        data={data}
        path={path}
        label={label}
        onFieldChange={onFieldChange}
        onUpload={onUpload}
        onArrayRemove={onArrayRemove}
        onArrayAdd={onArrayAdd}
        onArrayMove={onArrayMove}
        uploadingPath={uploadingPath}
        fileRefs={fileRefs}
        pathKey={pathKey}
      />
    );
  }

  // Object → render a section with nested fields.
  if (data && typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    return (
      <div className={label ? 'rounded-lg border border-gray/15 bg-white p-5 shadow-sm' : ''}>
        {label && (
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">
            {label}
          </h3>
        )}
        <div className="space-y-4">
          {entries.map(([key, value]) => (
            <FormNode
              key={key}
              data={value}
              path={[...path, key]}
              label={prettyLabel(key)}
              onFieldChange={onFieldChange}
              onUpload={onUpload}
              onArrayRemove={onArrayRemove}
              onArrayAdd={onArrayAdd}
              onArrayMove={onArrayMove}
              uploadingPath={uploadingPath}
              fileRefs={fileRefs}
              pathKey={pathKey}
            />
          ))}
        </div>
      </div>
    );
  }

  // String leaf.
  if (typeof data === 'string') {
    const lastSeg = path[path.length - 1];
    // When the leaf is inside a string array (e.g. paragraphs[], steps[]),
    // the last path segment is a number — use the parent key for the label.
    const key = typeof lastSeg === 'number'
      ? (path[path.length - 2] as string)
      : (lastSeg as string);
    const isImage = isImageKey(String(key));
    const isIcon = String(key) === 'icon';
    const long = isLongText(String(key), data);
    const labelText = typeof lastSeg === 'number'
      ? `${prettyLabel(key)} #${lastSeg + 1}`
      : prettyLabel(key);

    if (isImage) {
      const pkey = pathKey(path);
      const isUploading = uploadingPath !== null && pathKey(uploadingPath) === pkey;
      return (
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy">
            {labelText}
          </label>
          <div className="flex items-start gap-4">
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded border border-gray/20 bg-gray/10">
              {data ? (
                <Image
                  src={data}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray">
                  Görsel yok
                </div>
              )}
            </div>
            <div>
              <input
                ref={(el) => {
                  fileRefs.current[pkey] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(path, file);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => fileRefs.current[pkey]?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-2 rounded border border-teal px-4 py-2 text-xs font-semibold uppercase tracking-wide text-teal transition-colors hover:bg-teal hover:text-white disabled:opacity-60"
              >
                {isUploading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal/40 border-t-teal" />
                    Yükleniyor...
                  </>
                ) : (
                  'Görseli Değiştir'
                )}
              </button>
              <p className="mt-2 max-w-xs break-all text-xs text-gray">
                {data}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (isIcon) {
      return <IconPickerField path={path} label={labelText} value={data} onChange={onFieldChange} />;
    }

    return (
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy">
          {labelText}
        </label>
        {long ? (
          <textarea
            rows={4}
            value={data}
            onChange={(e) => onFieldChange(path, e.target.value)}
            className="w-full resize-y rounded border border-gray/30 px-3 py-2 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
          />
        ) : (
          <input
            type="text"
            value={data}
            onChange={(e) => onFieldChange(path, e.target.value)}
            className="w-full rounded border border-gray/30 px-3 py-2 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
          />
        )}
      </div>
    );
  }

  // Numbers / booleans / null — render a basic text input as fallback.
  if (typeof data === 'number' || typeof data === 'boolean') {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-navy">
          {prettyLabel(path[path.length - 1])}
        </label>
        <input
          type="text"
          value={String(data)}
          onChange={(e) =>
            onFieldChange(path, e.target.value)
          }
          className="w-full rounded border border-gray/30 px-3 py-2 text-sm text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
        />
      </div>
    );
  }

  return null;
}

// Array section with drag-and-drop reordering, add and remove controls. Split
// into its own component so hooks stay unconditional.
function ArrayNode({
  data,
  path,
  label,
  onFieldChange,
  onUpload,
  onArrayRemove,
  onArrayAdd,
  onArrayMove,
  uploadingPath,
  fileRefs,
  pathKey,
}: {
  data: unknown[];
  path: Path;
  label: string | null;
  onFieldChange: (path: Path, value: unknown) => void;
  onUpload: (path: Path, file: File) => void;
  onArrayRemove: (path: Path, index: number) => void;
  onArrayAdd: (path: Path) => void;
  onArrayMove: (path: Path, index: number, delta: number) => void;
  uploadingPath: Path | null;
  fileRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  pathKey: (p: Path) => string;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const onDrop = () => {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      onArrayMove(path, dragIndex, overIndex - dragIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="rounded-lg border border-gray/15 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        {label && (
          <h3 className="text-sm font-bold uppercase tracking-wide text-navy">
            {label}{' '}
            <span className="ml-1 text-xs font-normal text-gray">
              ({data.length} öğe)
            </span>
          </h3>
        )}
        <button
          type="button"
          onClick={() => onArrayAdd(path)}
          className="inline-flex items-center gap-1.5 rounded border border-teal px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal transition-colors hover:bg-teal hover:text-white"
        >
          <Icon name="Plus" className="h-3.5 w-3.5" />
          Ekle
        </button>
      </div>
      <div className="space-y-4">
        {data.map((item, i) => (
          <div
            key={
              item && typeof item === 'object' && 'id' in item
                ? String((item as Record<string, unknown>).id)
                : i
            }
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => {
              e.preventDefault();
              setOverIndex(i);
            }}
            onDragLeave={() => setOverIndex((cur) => (cur === i ? null : cur))}
            onDrop={onDrop}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={`rounded border bg-gray/5 p-4 transition-colors ${
              overIndex === i && dragIndex !== null && dragIndex !== i
                ? 'border-teal ring-2 ring-teal/30'
                : 'border-gray/10'
            } ${dragIndex === i ? 'opacity-60' : ''}`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2 text-xs font-bold uppercase tracking-wide text-teal">
                <Icon name="GripVertical" className="h-4 w-4 shrink-0 cursor-grab text-gray" />
                <span className="truncate">{itemLabel(item, i)}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => onArrayMove(path, i, -1)}
                  disabled={i === 0}
                  className="rounded p-1.5 text-gray transition-colors hover:bg-gray/10 hover:text-navy disabled:opacity-30"
                  aria-label="Yukarı taşı"
                  title="Yukarı taşı"
                >
                  <Icon name="ArrowUp" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onArrayMove(path, i, 1)}
                  disabled={i === data.length - 1}
                  className="rounded p-1.5 text-gray transition-colors hover:bg-gray/10 hover:text-navy disabled:opacity-30"
                  aria-label="Aşağı taşı"
                  title="Aşağı taşı"
                >
                  <Icon name="ArrowDown" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onArrayRemove(path, i)}
                  className="rounded p-1.5 text-gray transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Öğeyi sil"
                  title="Öğeyi sil"
                >
                  <Icon name="Trash2" className="h-4 w-4" />
                </button>
              </div>
            </div>
            <FormNode
              data={item}
              path={[...path, i]}
              label={null}
              onFieldChange={onFieldChange}
              onUpload={onUpload}
              onArrayRemove={onArrayRemove}
              onArrayAdd={onArrayAdd}
              onArrayMove={onArrayMove}
              uploadingPath={uploadingPath}
              fileRefs={fileRefs}
              pathKey={pathKey}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Icon picker field: a button showing the current icon plus a modal grid of
// every icon in the allowlist.
function IconPickerField({
  path,
  label,
  value,
  onChange,
}: {
  path: Path;
  label: string;
  value: string;
  onChange: (path: Path, value: unknown) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
          <Icon name={value} className="h-5 w-5" />
        </span>
        <input
          type="text"
          value={value}
          readOnly
          onClick={() => setOpen(true)}
          className="w-full rounded border border-gray/30 px-3 py-2 text-sm capitalize text-navy outline-none focus:border-teal focus:ring-1 focus:ring-teal"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded border border-teal px-4 py-2 text-xs font-semibold uppercase tracking-wide text-teal transition-colors hover:bg-teal hover:text-white"
        >
          Seç
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold uppercase tracking-tight text-navy">
                İkon seçin
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-gray hover:text-navy"
                aria-label="Kapat"
              >
                <Icon name="X" className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7">
              {iconNames.map((name) => {
                const active = name === value;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onChange(path, name);
                      setOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded border p-2 text-xs transition-colors ${
                      active
                        ? 'border-teal bg-teal/10 text-teal'
                        : 'border-gray/10 text-gray hover:border-teal/40 hover:text-navy'
                    }`}
                  >
                    <Icon name={name} className="h-5 w-5" />
                    <span className="capitalize">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}