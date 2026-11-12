
import React, { useState } from 'react';
import {
  PRESET_CATEGORIES,
  PRESET_TECHNOLOGIES,
} from '../consts/admin';
import type {
  ProjectLink,
  ProjectFormData,
} from '../types/admin';

export interface Project {
  id: string;
  title: string;
  category: string;
  descriptionTr: string;
  descriptionEn: string;
  techStack: string[];
  links?: ProjectLink[];
  projectUrl?: string;
  urlLabel?: string;
}

export type NewProject = Omit<Project, 'id'>;

interface ProjectsTabProps {
  projects?: Project[];
  onAddProject: (project: NewProject) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
}

const initialForm: ProjectFormData = {
  title: '',
  category: '',
  descriptionTr: '',
  descriptionEn: '',
  techStackInput: '',
};

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects = [],
  onAddProject,
  onDeleteProject,
}) => {
  const [projectForm, setProjectForm] =
    useState<ProjectFormData>(initialForm);

  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [linksList, setLinksList] = useState<ProjectLink[]>([
    { url: '', label: '' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech)
        ? prev.filter((item) => item !== tech)
        : [...prev, tech]
    );
  };

  const handleAddLinkRow = () => {
    setLinksList((prev) => [...prev, { url: '', label: '' }]);
  };

  const handleRemoveLinkRow = (index: number) => {
    setLinksList((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleLinkRowChange = (
    index: number,
    field: 'url' | 'label',
    value: string
  ) => {
    setLinksList((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const manualTechs = projectForm.techStackInput
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean);

      const finalTechStack = Array.from(
        new Set([...selectedTechs, ...manualTechs])
      );

      const validLinks = linksList
        .map((link) => ({
          url: link.url.trim(),
          label: link.label.trim(),
        }))
        .filter((link) => link.url !== '');

      const newProject: NewProject = {
        title: projectForm.title.trim(),
        category: projectForm.category,
        descriptionTr: projectForm.descriptionTr.trim(),
        descriptionEn: projectForm.descriptionEn.trim(),
        techStack: finalTechStack,
        links: validLinks,
      };

      if (!newProject.title || !newProject.category) {
        throw new Error('Proje adı ve kategori zorunludur.');
      }

      await onAddProject(newProject);

      setProjectForm({ ...initialForm });
      setSelectedTechs([]);
      setLinksList([{ url: '', label: '' }]);

      alert('Proje başarıyla eklendi!');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Proje eklenirken beklenmeyen bir hata oluştu.';

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm(
      `"${project.title}" projesini silmek istediğine emin misin?`
    );

    if (!confirmed || deletingId) return;

    setError(null);
    setDeletingId(project.id);

    try {
      await onDeleteProject(project.id);
      alert('Proje başarıyla silindi!');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Proje silinirken bir hata oluştu.';

      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">

      {/* Yeni Proje Formu */}
      <div className="bg-[#10141D] border border-white/8 rounded-3xl p-8 space-y-6">

        <h2 className="text-xl font-bold text-[#43D9C3]">
          Yeni Proje Ekle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Proje adı ve kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-[11px] font-mono text-[#9299A8] mb-1.5">
                PROJE ADI
              </label>

              <input
                type="text"
                placeholder="Örn: E-Commerce API"
                required
                maxLength={100}
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full bg-[#080A0F] border border-white/8 rounded-xl px-4 py-3 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#9299A8] mb-1.5">
                KATEGORİ
              </label>

              <select
                value={projectForm.category}
                onChange={(e) =>
                  setProjectForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                required
                className="w-full bg-[#080A0F] border border-white/8 rounded-xl px-4 py-3 text-sm text-white"
              >
                <option value="" disabled>
                  Kategori Seçin...
                </option>

                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Türkçe açıklama */}
          <div>
            <label className="block text-[11px] font-mono text-[#9299A8] mb-1.5">
              AÇIKLAMA (TÜRKÇE)
            </label>

            <textarea
              placeholder="Projenin detaylı açıklaması..."
              required
              maxLength={2000}
              rows={3}
              value={projectForm.descriptionTr}
              onChange={(e) =>
                setProjectForm((prev) => ({
                  ...prev,
                  descriptionTr: e.target.value,
                }))
              }
              className="w-full bg-[#080A0F] border border-white/8 rounded-xl px-4 py-3 text-sm text-white resize-none"
            />
          </div>

          {/* İngilizce açıklama */}
          <div>
            <label className="block text-[11px] font-mono text-[#9299A8] mb-1.5">
              DESCRIPTION (ENGLISH)
            </label>

            <textarea
              placeholder="Detailed description in English..."
              required
              maxLength={2000}
              rows={3}
              value={projectForm.descriptionEn}
              onChange={(e) =>
                setProjectForm((prev) => ({
                  ...prev,
                  descriptionEn: e.target.value,
                }))
              }
              className="w-full bg-[#080A0F] border border-white/8 rounded-xl px-4 py-3 text-sm text-white resize-none"
            />
          </div>

          {/* Teknolojiler */}
          <div className="space-y-3 pt-4 border-t border-white/8">

            <label className="block text-[11px] font-mono text-[#43D9C3] uppercase tracking-wider">
              KULLANILAN TEKNOLOJİLER
            </label>

            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_TECHNOLOGIES.map((tech) => {
                const isSelected = selectedTechs.includes(tech);

                return (
                  <button
                    key={tech}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleToggleTech(tech)}
                    className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#43D9C3] text-[#080A0F] border-[#43D9C3] font-bold'
                        : 'bg-[#080A0F] text-[#9299A8] border-white/8 hover:border-white/20'
                    }`}
                  >
                    {isSelected ? `✓ ${tech}` : `+ ${tech}`}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              placeholder="Ek teknolojiler (Redis, WebSockets...)"
              value={projectForm.techStackInput}
              onChange={(e) =>
                setProjectForm((prev) => ({
                  ...prev,
                  techStackInput: e.target.value,
                }))
              }
              className="w-full bg-[#080A0F] border border-white/8 rounded-xl px-4 py-3 text-sm text-white"
            />
          </div>

          {/* Proje bağlantıları */}
          <div className="space-y-3 pt-4 border-t border-white/8">

            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-[#43D9C3] uppercase tracking-wider">
                PROJE BAĞLANTILARI
              </label>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleAddLinkRow}
                className="text-xs font-mono bg-[#43D9C3]/10 text-[#43D9C3] border border-[#43D9C3]/30 px-3 py-1.5 rounded-xl"
              >
                + Link Ekle
              </button>
            </div>

            {linksList.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-3 items-center bg-[#080A0F] p-4 rounded-2xl border border-white/8"
              >
                <input
                  type="url"
                  placeholder="https://... (Proje Linki)"
                  value={item.url}
                  onChange={(e) =>
                    handleLinkRowChange(index, 'url', e.target.value)
                  }
                  className="w-full bg-[#10141D] border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white"
                />

                <input
                  type="text"
                  placeholder="Etiket (GitHub, Demo...)"
                  value={item.label}
                  onChange={(e) =>
                    handleLinkRowChange(index, 'label', e.target.value)
                  }
                  className="w-full bg-[#10141D] border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white"
                />

                {linksList.length > 1 && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleRemoveLinkRow(index)}
                    className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2.5 rounded-xl text-xs w-full sm:w-auto"
                  >
                    Sil
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Hata mesajı */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          {/* Gönder */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#43D9C3] text-[#080A0F] font-semibold py-4 rounded-xl text-xs font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? 'Kaydediliyor...'
              : '+ Projeyi Veritabanına Ekle'}
          </button>

        </form>
      </div>

      {/* Mevcut projeler */}
      <div className="space-y-4">

        <h3 className="text-lg font-bold">
          Mevcut Projeler ({projects.length})
        </h3>

        {projects.length === 0 ? (
          <div className="bg-[#10141D] border border-white/8 rounded-2xl p-8 text-center text-[#9299A8]">
            Henüz eklenmiş bir proje bulunmuyor.
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#10141D] border border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h4 className="font-bold text-base text-white">
                  {project.title}
                </h4>

                <span className="text-xs font-mono text-[#43D9C3] block mb-2">
                  {project.category}
                </span>

                <div className="flex flex-wrap gap-2 mb-2">
                  {project.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] text-[#9299A8] bg-[#080A0F] px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.links?.length ? (
                    project.links.map((link, index) => (
                      <a
                        key={`${project.id}-link-${index}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono bg-[#080A0F] border border-white/8 text-[#7C83FF] px-3 py-1 rounded-lg"
                      >
                        🔗 {link.label || 'Link'} ↗
                      </a>
                    ))
                  ) : project.projectUrl ? (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono bg-[#080A0F] border border-white/8 text-[#7C83FF] px-3 py-1 rounded-lg"
                    >
                      🔗 {project.urlLabel || 'Bağlantı'} ↗
                    </a>
                  ) : null}
                </div>
              </div>

              <button
                disabled={deletingId !== null}
                onClick={() => handleDelete(project)}
                className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-mono disabled:opacity-50 self-start sm:self-center"
              >
                {deletingId === project.id ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
