// src/shared/components/DataTransferDialog.tsx
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, DownloadSimple, UploadSimple, CheckCircle, Warning, FileArrowDown } from '@phosphor-icons/react';
import { Button } from '@/shared/components/ui/button';
import {
  exportAllData,
  downloadDataAsFile,
  importData,
  readDataFromFile,
  type ImportResult,
} from '@/shared/lib/dataTransfer';

interface DataTransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'export' | 'import';

export default function DataTransferDialog({ isOpen, onClose }: DataTransferDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>('export');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setError(null);
    try {
      const data = await exportAllData();
      downloadDataAsFile(data);
      // 延迟关闭，让用户看到成功状态
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 800);
    } catch {
      setError('导出失败，请重试');
      setIsExporting(false);
    }
  }, [onClose]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件类型
      const isJsonFile = file.name.toLowerCase().endsWith('.json') || file.type === 'application/json';
      if (!isJsonFile) {
        setError('请选择 JSON 格式的文件');
        setSelectedFile(null);
        // 重置 input 以便可以再次选择同一文件
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      setError(null);
      setImportResult(null);
    }
  }, []);

  const handleImport = useCallback(async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setError(null);
    setImportResult(null);

    try {
      const data = await readDataFromFile(selectedFile);

      // 验证数据格式
      if (!data.reminders && !data.tasks && !data.parkingRecords) {
        throw new Error('无效的数据文件格式');
      }

      const result = await importData(data, { skipDuplicates: true });
      setImportResult(result);
      setIsImporting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '导入失败');
      setIsImporting(false);
    }
  }, [selectedFile]);

  const handleClose = useCallback(() => {
    setActiveTab('export');
    setSelectedFile(null);
    setImportResult(null);
    setError(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-3xl bg-[#141416] border border-white/[0.08] p-6 shadow-2xl shadow-black/50"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
        >
          <X weight="bold" className="w-5 h-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-6">数据管理</h2>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-xl bg-white/[0.03] mb-6">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'export'
                ? 'bg-blue-500 text-white'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <DownloadSimple weight="bold" className="w-4 h-4" />
            导出数据
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'import'
                ? 'bg-emerald-500 text-[#0a0a0b]'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <UploadSimple weight="bold" className="w-4 h-4" />
            导入数据
          </button>
        </div>

        {/* Export Tab */}
        {activeTab === 'export' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <FileArrowDown weight="bold" className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">导出所有数据</h3>
                  <p className="text-sm text-white/40">将倒数日、任务和停车记录导出为 JSON 文件</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white rounded-xl py-5 font-medium transition-all disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                  />
                  导出中...
                </>
              ) : (
                <>
                  <DownloadSimple weight="bold" className="w-4 h-4 mr-2" />
                  下载备份文件
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {!importResult ? (
              <>
                <label
                  htmlFor="file-input"
                  className={`block p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                    selectedFile
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.15]'
                  }`}
                >
                  <input
                    id="file-input"
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="sr-only"
                    style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
                  />
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                        selectedFile ? 'bg-emerald-500/20' : 'bg-white/[0.05]'
                      }`}
                    >
                      {selectedFile ? (
                        <CheckCircle weight="bold" className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <UploadSimple weight="bold" className="w-6 h-6 text-white/40" />
                      )}
                    </div>
                    {selectedFile ? (
                      <>
                        <p className="font-medium text-white mb-1">{selectedFile.name}</p>
                        <p className="text-sm text-white/40">点击更换文件</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-white mb-1">选择备份文件</p>
                        <p className="text-sm text-white/40">支持 .json 格式</p>
                      </>
                    )}
                  </div>
                </label>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                  >
                    <Warning weight="bold" className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                <Button
                  onClick={handleImport}
                  disabled={!selectedFile || isImporting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0b] rounded-xl py-5 font-medium transition-all disabled:opacity-50"
                >
                  {isImporting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-[#0a0a0b]/30 border-t-[#0a0a0b] rounded-full mr-2"
                      />
                      导入中...
                    </>
                  ) : (
                    <>
                      <UploadSimple weight="bold" className="w-4 h-4 mr-2" />
                      开始导入
                    </>
                  )}
                </Button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="flex flex-col items-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle weight="bold" className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">导入完成</h3>
                  <p className="text-sm text-white/40">重复的数据已自动跳过</p>
                </div>

                <div className="space-y-2">
                  <ResultRow
                    label="倒数日"
                    added={importResult.reminders.added}
                    skipped={importResult.reminders.skipped}
                  />
                  <ResultRow
                    label="任务"
                    added={importResult.tasks.added}
                    skipped={importResult.tasks.skipped}
                  />
                  <ResultRow
                    label="停车记录"
                    added={importResult.parkingRecords.added}
                    skipped={importResult.parkingRecords.skipped}
                  />
                </div>

                <Button
                  onClick={handleClose}
                  className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl py-5 font-medium transition-all"
                >
                  完成
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function ResultRow({
  label,
  added,
  skipped,
}: {
  label: string;
  added: number;
  skipped: number;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
      <span className="text-white/60">{label}</span>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-emerald-400">+{added} 新增</span>
        {skipped > 0 && <span className="text-white/30">{skipped} 跳过</span>}
      </div>
    </div>
  );
}
