import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

function StructureCard({ person, label }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center min-w-[140px] hover:shadow-lg transition">
      <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-2 overflow-hidden border-2 border-gray-200">
        {person?.photo_url ? (
          <img src={person.photo_url} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-serif">
            {person?.name?.charAt(0) || '?'}
          </div>
        )}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
      <div className="font-medium text-sm text-gray-900 mt-1">
        {person?.name || 'Belum diisi'}
      </div>
    </div>
  );
}

export default function AboutStructure() {
  const [team, setTeam] = useState({});

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('profiles')
        .select('name, role, photo_url, cluster')
        .neq('role', 'member');
      
      // Group by role
      const grouped = {
        supervisor: data?.filter(p => p.role?.includes('supervisor')) || [],
        bph: data?.filter(p => p.role?.includes('bph')) || [],
        cda: data?.filter(p => p.role?.includes('cda')) || [],
        mbd: data?.filter(p => p.role?.includes('mbd')) || [],
        heg: data?.filter(p => p.role?.includes('heg')) || [],
        korvoks: data?.filter(p => p.role?.includes('korvoks')) || [],
      };
      setTeam(grouped);
    }
    load();
  }, []);

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">
            — Struktur Organisasi
          </div>
          <h2 className="font-serif text-4xl">
            Kepengurusan <em className="italic text-red-700">Aksara Karya</em>
          </h2>
        </div>

        {/* TREE BAGAN */}
        <div className="flex flex-col items-center gap-8">
          {/* LEVEL 1: Supervisor */}
          <div className="flex flex-wrap gap-4 justify-center">
            {team.supervisor?.length > 0 ? team.supervisor.map((p, i) => (
              <StructureCard key={i} person={p} label="Supervisor" />
            )) : <StructureCard label="Supervisor" />}
          </div>

          {/* CONNECTOR */}
          <div className="w-px h-8 bg-gray-300"></div>

          {/* LEVEL 2: BPH */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 text-center mb-3">
              Badan Pengurus Harian
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {team.bph?.length > 0 ? team.bph.map((p, i) => (
                <StructureCard key={i} person={p} label="BPH" />
              )) : (
                <>
                  <StructureCard label="Ketua" />
                  <StructureCard label="Wakil" />
                  <StructureCard label="Sekretaris" />
                  <StructureCard label="Bendahara" />
                </>
              )}
            </div>
          </div>

          {/* CONNECTOR */}
          <div className="w-px h-8 bg-gray-300"></div>

          {/* LEVEL 3: Divisi Fungsional (4 parallel) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
            {[
              { key: 'cda', label: 'CDA' },
              { key: 'mbd', label: 'MBD' },
              { key: 'heg', label: 'HEG' },
              { key: 'korvoks', label: 'Korvoks' },
            ].map(div => (
              <div key={div.key} className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
                  Divisi {div.label}
                </div>
                <div className="flex flex-col gap-3 items-center">
                  {team[div.key]?.length > 0 ? team[div.key].map((p, i) => (
                    <StructureCard key={i} person={p} label={div.label} />
                  )) : <StructureCard label={div.label} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}