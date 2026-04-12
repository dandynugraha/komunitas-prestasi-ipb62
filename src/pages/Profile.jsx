import { useState } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  // Cek apakah user bisa upload foto (selain member)
  const canUploadPhoto = profile?.role && profile.role !== 'member';

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!canUploadPhoto) {
      toast.error('Hanya staff/BPH/Supervisor yang bisa upload foto struktur');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${ext}`;
      
      const { error: upErr } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, { upsert: true });
      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      const { error: dbErr } = await supabase
        .from('profiles')
        .update({ photo_url: publicUrl })
        .eq('id', user.id);
      if (dbErr) throw dbErr;

      toast.success('Foto berhasil diupload. Akan muncul di halaman About.');
      refreshProfile?.();
    } catch (err) {
      toast.error('Gagal upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="font-serif text-3xl mb-6">Profil Saya</h2>
      
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
            {profile?.photo_url ? (
              <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-serif text-gray-400">
                {profile?.name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="font-serif text-xl">{profile?.name}</div>
            <div className="text-sm text-gray-500">{profile?.email}</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">
              {profile?.role}
            </div>
          </div>
        </div>

        {canUploadPhoto ? (
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
              Foto untuk Struktur Organisasi
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="block w-full text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Foto ini akan tampil di halaman About. Rekomendasi: foto formal, rasio 1:1, min 400x400px.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Hanya Supervisor, BPH, dan Staff (CDA/MBD/HEG/Korvoks) yang bisa upload foto untuk struktur.
          </p>
        )}
      </div>
    </div>
  );
}