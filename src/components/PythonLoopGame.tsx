import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  Code,
  Play,
  RotateCcw,
  Lightbulb,
  Star,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

import { challenges } from "./challanges";

type PyodideInterface = any;

const PYODIDE_VERSION = "0.24.1";
const PYODIDE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${PYODIDE_BASE_URL}pyodide.js`;

declare global {
  interface Window {
    loadPyodide?: (options?: { indexURL?: string }) => Promise<PyodideInterface>;
    __pyodideInstance?: PyodideInterface;
    __pyodideLoadingPromise?: Promise<PyodideInterface>;
    __pyodideScriptLoadingPromise?: Promise<void>;
  }
}

const ensurePyodideScript = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Pyodide poate fi încărcat doar în mediul browser."),
    );
  }

  if (window.loadPyodide) {
    return Promise.resolve();
  }

  if (window.__pyodideScriptLoadingPromise) {
    return window.__pyodideScriptLoadingPromise;
  }

  window.__pyodideScriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PYODIDE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Nu am putut încărca script-ul Pyodide."));
    document.body.appendChild(script);
  });

  return window.__pyodideScriptLoadingPromise;
};

const loadPyodideInstance = async (): Promise<PyodideInterface> => {
  if (typeof window === "undefined") {
    throw new Error("Pyodide nu este disponibil în afara browser-ului");
  }

  if (window.__pyodideInstance) {
    return window.__pyodideInstance;
  }

  if (window.__pyodideLoadingPromise) {
    return window.__pyodideLoadingPromise;
  }

  await ensurePyodideScript();

  if (!window.loadPyodide) {
    throw new Error("Funcția loadPyodide nu este disponibilă");
  }

  window.__pyodideLoadingPromise = window
    .loadPyodide({ indexURL: PYODIDE_BASE_URL })
    .then((instance) => {
      window.__pyodideInstance = instance;
      return instance;
    });

  return window.__pyodideLoadingPromise;
};


export function PythonLoopGame() {
  const [currentChallengeIndex, setCurrentChallengeIndex] =
    useState(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(
    null,
  );
  const [completedChallenges, setCompletedChallenges] =
    useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const [pyodideError, setPyodideError] = useState<string | null>(
    null,
  );
  const [isSolutionShown, setIsSolutionShown] = useState(false);
  const [previousUserCode, setPreviousUserCode] = useState<string>("");

  const currentChallenge = challenges[currentChallengeIndex];

  useEffect(() => {
    setCode("");
    setOutput("");
    setIsCorrect(null);
    setShowHint(false);
    setCurrentHintIndex(0);
    setIsSolutionShown(false);
    setPreviousUserCode("");
  }, [currentChallengeIndex]);

  useEffect(() => {
    let cancelled = false;

    if (typeof window === "undefined") {
      return () => {
        cancelled = true;
      };
    }

    const initializePyodide = async () => {
      setIsPyodideLoading(true);
      setPyodideError(null);
      try {
        await loadPyodideInstance();
        if (!cancelled) {
          setPyodideReady(true);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Nu am reușit să inițializăm motorul Python.";
          setPyodideError(message);
          toast.error("Nu am putut încărca motorul Python.", {
            description: message,
          });
        }
      } finally {
        if (!cancelled) {
          setIsPyodideLoading(false);
        }
      }
    };

    initializePyodide();

    return () => {
      cancelled = true;
    };
  }, []);

  const normalizeOutput = (value: string) =>
    value.replace(/\r\n/g, "\n");

  const runCode = async () => {
    if (isRunning) {
      return;
    }

    if (!pyodideReady) {
      toast.info("Motorul Python se încarcă...", {
        description: "Te rugăm să aștepți finalizarea inițializării.",
      });
      return;
    }

    setIsRunning(true);
    setIsCorrect(null);

    try {
      const pyodide = await loadPyodideInstance();

      let executionResultProxy: any;
      try {
        pyodide.globals.set("USER_CODE", code);
        executionResultProxy = await pyodide.runPythonAsync(
          `
          import sys, io, traceback, json
          code = USER_CODE
          output = io.StringIO()
          error = None
          sys.stdout = output
          sys.stderr = output
          try:
              exec(code, globals())
          except Exception as exc:
              error = "".join(traceback.format_exception(exc.__class__, exc, exc.__traceback__))
          finally:
              sys.stdout = sys.__stdout__
              sys.stderr = sys.__stderr__
          
          json.dumps({"output": output.getvalue(), "error": error})
          `)
          
      } finally {
        try {
          pyodide.runPython("globals().pop('USER_CODE', None)");
        } catch (_error) {
          // Ignorăm erorile de curățare
        }
      }
      console.log("executionResultProxy", executionResultProxy);
      const { output, error } = JSON.parse(executionResultProxy);
      if (error) {
        setOutput(error);
        setIsCorrect(false);
        return;
      }
      else setOutput(output);

      const expectedOutput =
        currentChallenge.testCases?.[0]?.expectedOutput ?? "";
      const normalizedExpected = normalizeOutput(expectedOutput).trim();
      const normalizedResult = output.trim();

      const correct = normalizedResult === normalizedExpected;
      setIsCorrect(correct);

      if (correct) {
        if (!completedChallenges.has(currentChallenge.id)) {
          const newCompleted = new Set(completedChallenges);
          newCompleted.add(currentChallenge.id);
          setCompletedChallenges(newCompleted);
          setStars((prev) => prev + 1);
          toast.success("🎉 Corect! Provocare completată!", {
            description: "Ai câștigat o stea! ⭐",
          });
        } else {
          toast.success("✅ Cod corect!");
        }
      } else {
        toast.error("❌ Încearcă din nou", {
          description:
            "Output-ul nu este corect. Verifică codul!",
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Eroare la executarea codului.";

      setOutput(message);
      setIsCorrect(false);

      toast.error("Eroare în cod", {
        description: message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode("");
    setOutput("");
    setIsCorrect(null);
    setShowHint(false);
    setCurrentHintIndex(0);
    setIsSolutionShown(false);
    setPreviousUserCode("");
  };

  const toggleSolution = () => {
    const solutionCode =
      currentChallenge.solution ?? currentChallenge.starterCode ?? "";

    if (!solutionCode) {
      return;
    }

    if (isSolutionShown) {
      setCode(previousUserCode);
      setIsSolutionShown(false);
      setPreviousUserCode("");
      return;
    }

    setPreviousUserCode(code);
    setCode(solutionCode);
    setIsSolutionShown(true);
  };

  const nextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex((prev) => prev + 1);
    }
  };

  const previousChallenge = () => {
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex((prev) => prev - 1);
    }
  };

  const showNextHint = () => {
    if (currentHintIndex < currentChallenge.hints.length - 1) {
      setCurrentHintIndex((prev) => prev + 1);
    }
    setShowHint(true);
  };

  const progress =
    (completedChallenges.size / challenges.length) * 100;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Toaster />

      {/* Header */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Code className="w-10 h-10 text-indigo-600" />
          <h1 className="text-indigo-900">
            Python Loop Master
          </h1>
        </div>
        <p className="text-gray-600">
          Învață loop-urile Python prin practică interactivă!
        </p>

        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>{stars} Stele</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>
              {completedChallenges.size}/{challenges.length}{" "}
              Completate
            </span>
          </div>
        </div>

        <div className="mt-4 max-w-md mx-auto">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-gray-500 mt-1">
            {Math.round(progress)}% Progres
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Challenge */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={
                      currentChallenge.category === "for"
                        ? "default"
                        : currentChallenge.category === "while"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {currentChallenge.category.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Nivel {currentChallenge.id}/8
                  </span>
                  {completedChallenges.has(
                    currentChallenge.id,
                  ) && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <h2 className="text-indigo-900">
                  {currentChallenge.title}
                </h2>
                <p className="text-gray-600 mt-2">
                  {currentChallenge.description}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h3 className="text-blue-900 mb-2">
                📝 Sarcină:
              </h3>
              <p className="text-blue-800">
                {currentChallenge.task}
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <h3 className="text-yellow-900 mb-2">
                🎯 Output așteptat:
              </h3>
              <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
                <code>
                  {currentChallenge.testCases[0].expectedOutput}
                </code>
              </pre>
            </div>

            {/* Hints */}
            <div className="mt-4">
              {!showHint ? (
                <Button
                  onClick={() => {
                    setShowHint(true);
                    setCurrentHintIndex(0);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Arată Hint
                </Button>
              ) : (
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-purple-900 mb-2">
                        💡 Hint {currentHintIndex + 1}/
                        {currentChallenge.hints.length}:
                      </h3>
                      <p className="text-purple-800">
                        {
                          currentChallenge.hints[
                            currentHintIndex
                          ]
                        }
                      </p>
                      {currentHintIndex <
                        currentChallenge.hints.length - 1 && (
                        <Button
                          onClick={showNextHint}
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                        >
                          Următorul Hint →
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Navigation */}
          <Card className="p-4">
            <div className="flex gap-2">
              <Button
                onClick={previousChallenge}
                disabled={currentChallengeIndex === 0}
                variant="outline"
                className="flex-1"
              >
                ← Anteriorul
              </Button>
              <Button
                onClick={nextChallenge}
                disabled={
                  currentChallengeIndex ===
                  challenges.length - 1
                }
                variant="outline"
                className="flex-1"
              >
                Următorul →
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Editor Python</h3>
              <div className="flex gap-2">
                <Button
                  onClick={resetCode}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={toggleSolution}
                  variant="outline"
                  size="sm"
                  disabled={
                    !currentChallenge.solution &&
                    !currentChallenge.starterCode
                  }
                  className={
                    isSolutionShown
                      ? "border-indigo-600 text-indigo-600"
                      : undefined
                  }
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isSolutionShown ? "Ascunde Soluția" : "Arată Soluția"}
                </Button>
                <Button
                  onClick={runCode}
                  size="sm"
                  disabled={
                    isRunning ||
                    isPyodideLoading ||
                    !pyodideReady ||
                    !!pyodideError
                  }
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning
                    ? "Se rulează..."
                    : pyodideReady
                      ? "Rulează"
                      : "Se încarcă..."}
                </Button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg border-2 border-gray-700 focus:border-indigo-500 focus:outline-none resize-none"
              spellCheck={false}
              placeholder="Scrie codul tău aici..."
            />

            {isPyodideLoading && !pyodideReady && !pyodideError && (
              <p className="text-xs text-gray-500 mt-3">
                Se încarcă motorul Python (Pyodide)... poate dura câteva secunde la prima utilizare.
              </p>
            )}

            {pyodideError && (
              <p className="text-xs text-red-600 mt-3">
                {pyodideError}
              </p>
            )}
          </Card>

          {/* Output */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-gray-900">Output</h3>
              {isCorrect !== null &&
                (isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                ))}
            </div>

            <div
              className={`p-4 rounded-lg border-2 min-h-32 ${
                isCorrect === true
                  ? "bg-green-50 border-green-500"
                  : isCorrect === false
                    ? "bg-red-50 border-red-500"
                    : "bg-gray-50 border-gray-300"
              }`}
            >
              {output ? (
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  <code>{output}</code>
                </pre>
              ) : (
                <p className="text-gray-400 italic">
                  Apasă "Rulează" pentru a vedea rezultatul...
                </p>
              )}
            </div>

            {isCorrect === true &&
              completedChallenges.has(currentChallenge.id) &&
              currentChallengeIndex < challenges.length - 1 && (
                <Button
                  onClick={nextChallenge}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                >
                  Provocare Următoare →
                </Button>
              )}
          </Card>

          {/* All Stars Achievement */}
          {completedChallenges.size === challenges.length && (
            <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400">
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-8 h-8 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <h3 className="text-yellow-900 mb-2">
                  🎉 Felicitări!
                </h3>
                <p className="text-yellow-800">
                  Ai completat toate provocările! Ești un Python
                  Loop Master!
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Challenge List */}
      <Card className="p-6 mt-6">
        <h3 className="text-gray-900 mb-4">
          Toate Provocările
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {challenges.map((challenge, index) => (
            <Button
              key={challenge.id}
              onClick={() => setCurrentChallengeIndex(index)}
              variant={
                currentChallengeIndex === index
                  ? "default"
                  : "outline"
              }
              className="relative"
            >
              {completedChallenges.has(challenge.id) && (
                <Star className="w-4 h-4 absolute -top-1 -right-1 fill-yellow-400 text-yellow-400" />
              )}
              Nivel {challenge.id}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}