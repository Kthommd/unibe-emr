import React, { useState, useEffect, useCallback, useMemo } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Plus } from "lucide-react";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [note, setNote] = useState({
    subjective: "",
    objective: "",
    analysis: "",
    plan: "",
    labs: "",
    imaging: "",
    referrals: "",
    results: "",
    medications: ""
  });
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    sexo: "",
    edad: "",
    peso: "",
    talla: "",
    imc: "",
    pa: "",
    fc: "",
    fr: "",
    temp: "",
    spo2: ""
  });
  const [showMenu, setShowMenu] = useState(false);
  const [history, setHistory] = useState([]);

  // Autosave from localStorage
  useEffect(() => {
    const savedPatients = localStorage.getItem("patients");
    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  const currentPatient = useMemo(
    () => patients.find((p) => p.id === currentPatientId),
    [patients, currentPatientId]
  );

  useEffect(() => {
    if (currentPatient) {
      setHistory(currentPatient.history || []);
      setPatientInfo(currentPatient.info);
    }
  }, [currentPatient]);

  const addPatient = () => {
    if (!patientInfo.name.trim()) return;
    const newPatient = {
      id: Date.now(),
      info: patientInfo,
      history: []
    };
    setPatients((prev) => [...prev, newPatient]);
    setCurrentPatientId(newPatient.id);
    setPatientInfo({
      name: "",
      sexo: "",
      edad: "",
      peso: "",
      talla: "",
      imc: "",
      pa: "",
      fc: "",
      fr: "",
      temp: "",
      spo2: ""
    });
  };

  const saveNote = () => {
    if (!currentPatientId) return;
    const newHistory = [
      ...history,
      {
        date: new Date().toLocaleString(),
        ...note,
        patientInfo
      }
    ];
    setHistory(newHistory);
    setPatients((prev) =>
      prev.map((p) =>
        p.id === currentPatientId
          ? { ...p, history: newHistory, info: patientInfo }
          : p
      )
    );
    setNote({
      subjective: "",
      objective: "",
      analysis: "",
      plan: "",
      labs: "",
      imaging: "",
      referrals: "",
      results: "",
      medications: ""
    });
  };

  const exportPDF = (entry) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Nota - ${entry.patientInfo.name}`, 14, 15);
    doc.setFontSize(12);
    doc.text(
      `Sexo: ${entry.patientInfo.sexo || ""}  Edad: ${entry.patientInfo.edad || ""}  Peso: ${entry.patientInfo.peso || ""}kg  Talla: ${entry.patientInfo.talla || ""}cm  IMC: ${entry.patientInfo.imc || ""}`,
      14,
      25
    );
    doc.text(
      `PA: ${entry.patientInfo.pa || ""}  FC: ${entry.patientInfo.fc || ""}  FR: ${entry.patientInfo.fr || ""}  Temp: ${entry.patientInfo.temp || ""}°C  SpO₂: ${entry.patientInfo.spo2 || ""}%`,
      14,
      32
    );
    doc.autoTable({
      startY: 40,
      head: [["Sección", "Contenido"]],
      body: [
        ["Subjetivo", entry.subjective],
        ["Objetivo", entry.objective],
        ["Análisis", entry.analysis],
        ["Plan", entry.plan],
        ["Laboratorios", entry.labs],
        ["Imágenes", entry.imaging],
        ["Referencias", entry.referrals],
        ["Resultados", entry.results],
        ["Medicamentos", entry.medications]
      ]
    });
    doc.save(`Nota-${entry.patientInfo.name}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-400 p-4 text-white text-xl font-bold">
        UNIBE-EMR
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow p-4">
          <h2 className="font-bold mb-2">Pacientes</h2>
          <ul>
            {patients.map((p) => (
              <li
                key={p.id}
                className={`cursor-pointer p-2 rounded ${
                  p.id === currentPatientId ? "bg-blue-200" : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentPatientId(p.id)}
              >
                {p.info.name}
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2">
            <input
              className="border p-1 w-full"
              placeholder="Nombre"
              value={patientInfo.name}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, name: e.target.value })
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="Sexo"
              value={patientInfo.sexo}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, sexo: e.target.value })
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="Edad"
              value={patientInfo.edad}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, edad: e.target.value })
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="Peso"
              value={patientInfo.peso}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, peso: e.target.value })
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="Talla"
              value={patientInfo.talla}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, talla: e.target.value })
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="IMC"
              value={patientInfo.imc}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, imc: e.target.value })
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="PA"
              value={patientInfo.pa}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, pa: e.target.value })
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="FC"
              value={patientInfo.fc}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, fc: e.target.value })
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="FR"
              value={patientInfo.fr}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, fr: e.target.value })
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="Temp"
              value={patientInfo.temp}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, temp: e.target.value })
              }
            />
            <input
              className="border p-1 w-full"
              placeholder="SpO₂"
              value={patientInfo.spo2}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, spo2: e.target.value })
              }
            />
            <button
              onClick={addPatient}
              className="bg-blue-500 text-white w-full py-1 rounded"
            >
              Añadir paciente
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4">
          {currentPatient && (
            <>
              <h2 className="font-bold text-lg mb-2">
                Notas de: {currentPatient.info.name}
              </h2>
              <p className="text-sm mb-4">
                Sexo: {patientInfo.sexo} | Edad: {patientInfo.edad} | Peso:{" "}
                {patientInfo.peso}kg | Talla: {patientInfo.talla}cm | IMC:{" "}
                {patientInfo.imc} | PA: {patientInfo.pa} | FC: {patientInfo.fc} |
                FR: {patientInfo.fr} | Temp: {patientInfo.temp}°C | SpO₂:{" "}
                {patientInfo.spo2}%
              </p>

              {/* SOAP inputs */}
              <textarea
                className="border p-2 w-full mb-2"
                placeholder="Subjetivo"
                value={note.subjective}
                onChange={(e) =>
                  setNote({ ...note, subjective: e.target.value })
                }
              />
              <textarea
                className="border p-2 w-full mb-2"
                placeholder="Objetivo"
                value={note.objective}
                onChange={(e) =>
                  setNote({ ...note, objective: e.target.value })
                }
              />
              <textarea
                className="border p-2 w-full mb-2"
                placeholder="Análisis"
                value={note.analysis}
                onChange={(e) =>
                  setNote({ ...note, analysis: e.target.value })
                }
              />
              <textarea
                className="border p-2 w-full mb-2"
                placeholder="Plan"
                value={note.plan}
                onChange={(e) => setNote({ ...note, plan: e.target.value })}
              />
              <textarea
                className="border p-2 w-full mb-2"
                placeholder="Laboratorios"
                value={note.labs}
                onChange={(e) => setNote({ ...note, labs: e.target.value })}
              />
              <textarea
                className="border p-2 w-full mb-2"
                placeholder="Estudio de imágenes"
                value={note.imaging}
                onChange={(e) => setNote({ ...note, imaging: e.target.value })}
              />
              <textarea
                className="border p-2 w-full mb-2"
                placeholder="Referencias"
                value={note.referrals}
                onChange={(e) => setNote({ ...note, referrals: e.target.value })}
              />
              <textarea
                className="border p-2 w-full mb-2"
                placeholder="Resultados"
                value={note.results}
                onChange={(e) => setNote({ ...note, results: e.target.value })}
              />
              <textarea
                className="border p-2 w-full mb-2"
                placeholder="Medicamentos"
                value={note.medications}
                onChange={(e) =>
                  setNote({ ...note, medications: e.target.value })
                }
              />
              <div className="flex gap-2">
                <button
                  onClick={saveNote}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Guardar nota
                </button>
              </div>

              {/* History */}
              <h3 className="font-bold mt-6 mb-2">Historial</h3>
              {history.map((entry, index) => (
                <div key={index} className="border p-2 mb-2 bg-white rounded">
                  <p className="text-sm">{entry.date}</p>
                  <p className="text-sm">
                    Sexo: {entry.patientInfo.sexo} | Edad: {entry.patientInfo.edad} | Peso:{" "}
                    {entry.patientInfo.peso}kg | Talla: {entry.patientInfo.talla}cm | IMC:{" "}
                    {entry.patientInfo.imc} | PA: {entry.patientInfo.pa} | FC: {entry.patientInfo.fc} | FR:{" "}
                    {entry.patientInfo.fr} | Temp: {entry.patientInfo.temp}°C | SpO₂: {entry.patientInfo.spo2}%
                  </p>
                  <button
                    onClick={() => exportPDF(entry)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mt-1"
                  >
                    Exportar PDF
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
