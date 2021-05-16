  
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import loader from '@monaco-editor/loader';
import state from 'state-local';

import MonacoContainer from '../Container';
import useUpdate from '../hooks/useUpdate';
import usePrevious from '../hooks/usePrevious';
import { noop, getOrCreateModel, isUndefined } from '../utils';

const defaultConfig = {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.23.0/min/vs',
  },
}

const [getModelMarkersSetter, setModelMarkersSetter] = state.create({
  backup: null,
});

const [getState, setState] = state.create({
  config: defaultConfig,
  isInitialized: false,
  resolve: null,
  reject: null,
  monaco: null,
});

const viewStates = new Map();

const _noop = () => {};

type EditorPropsType = {
  defaultValue: string;
  defaultPath: string;
  defaultLanguage: string;
  value: string;
  language: string;
  path: string;

  theme: string;
  line: number;
  loading: React.ReactNode |string;
  options: object;
  overrideServices: object;
  saveViewState: boolean;
  keepCurrentModel: boolean;

  width: number | string
  height: number | string
  className: string;
  wrapperClassName: string;
  /* === */
  beforeMount: func;
  onMount: func;
  onChange: func;
  onValidate: func;
};

const Editor: React.FC<EditorPropsType> = ({
  defaultValue,
  defaultLanguage,
  defaultPath,
  value,
  language,
  path,

  theme = 'light',
  line,
  loading='Loading...',
  options={},
  overrideServices={},
  saveViewState=true,
  keepCurrentModel=false,

  width="100%",
  height="100%",
  className,
  wrapperClassName,

  beforeMount=_noop,
  onMount=_noop,
  onChange,
  onValidat=_noop,
})  => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isMonacoMounting, setIsMonacoMounting] = useState(true);
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const onMountRef = useRef(onMount);
  const beforeMountRef = useRef(beforeMount);
  const subscriptionRef = useRef(null);
  const valueRef = useRef(value);
  const previousPath = usePrevious(path);

  useEffect(() => {
    const cancelable = loader.init() as any;

    cancelable
      .then(monaco => ((monacoRef.current = monaco) && setIsMonacoMounting(false)))
      .catch(error => error?.type !== 'cancelation' &&
        console.error('Monaco initialization: error:', error));

    return () => editorRef.current ? disposeEditor() : cancelable.cancel();
  }, []);

  useUpdate(() => {
    const model = getOrCreateModel(
      monacoRef.current,
      defaultValue || value,
      defaultLanguage || language,
      path,
    );

    if (model !== editorRef.current.getModel()) {
      saveViewState && viewStates.set(previousPath, editorRef.current.saveViewState());
      editorRef.current.setModel(model);
      saveViewState && editorRef.current.restoreViewState(viewStates.get(path));
    }
  }, [path], isEditorReady);

  useUpdate(() => {
    editorRef.current.updateOptions(options);
  }, [options], isEditorReady);

  useUpdate(() => {
    if (editorRef.current.getOption(monacoRef.current.editor.EditorOption.readOnly)) {
      editorRef.current.setValue(value);
    } else {
      if (value !== editorRef.current.getValue()) {
        editorRef.current.executeEdits('', [{
          range: editorRef.current.getModel().getFullModelRange(),
          text: value,
          forceMoveMarkers: true,
        }]);

        editorRef.current.pushUndoStop();
      }
    }
  }, [value], isEditorReady);

  useUpdate(() => {
    monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), language);
  }, [language], isEditorReady);

  useUpdate(() => {
    // reason for undefined check: https://github.com/suren-atoyan/monaco-react/pull/188
    if(!isUndefined(line)) {
      editorRef.current.revealLine(line);
    }
  }, [line], isEditorReady);

  useUpdate(() => {
    monacoRef.current.editor.setTheme(theme);
  }, [theme], isEditorReady);

  const createEditor = useCallback(() => {
    beforeMountRef.current(monacoRef.current);
    const autoCreatedModelPath = path || defaultPath;

    const defaultModel = getOrCreateModel(
      monacoRef.current,
      value || defaultValue,
      defaultLanguage || language,
      autoCreatedModelPath,
    );

    editorRef.current = monacoRef.current.editor.create(containerRef.current, {
      model: defaultModel,
      automaticLayout: true,
      ...options,
    }, overrideServices);

    saveViewState && editorRef.current.restoreViewState(viewStates.get(autoCreatedModelPath));

    monacoRef.current.editor.setTheme(theme);

    if (!getModelMarkersSetter().backup) {
      setModelMarkersSetter({
        backup: monacoRef.current.editor.setModelMarkers,
      });
    }

    setIsEditorReady(true);
  }, [
    defaultValue,
    defaultLanguage,
    defaultPath,
    value,
    language,
    path,
    options,
    overrideServices,
    saveViewState,
    theme,
  ]);

  useEffect(() => {
    if (isEditorReady) {
      onMountRef.current(
        editorRef.current,
        monacoRef.current,
      );
    }
  }, [isEditorReady]);

  useEffect(() => {
    !isMonacoMounting && !isEditorReady && createEditor();
  }, [isMonacoMounting, isEditorReady, createEditor]);

  // subscription
  // to avoid unnecessary updates (attach - dispose listener) in subscription
  valueRef.current = value;

  useEffect(() => {
    if (isEditorReady && onChange) {
      subscriptionRef.current?.dispose();
      subscriptionRef.current = editorRef.current?.onDidChangeModelContent(event => {
        const editorValue = editorRef.current.getValue();

        if (valueRef.current !== editorValue) {
          onChange(editorValue, event);
        }
      });
    }
  }, [isEditorReady, onChange]);

  // onValidate
  useEffect(() => {
    if (isEditorReady) {
      monacoRef.current.editor.setModelMarkers = function(model, owner, markers) {
        getModelMarkersSetter().backup?.call(
          monacoRef.current.editor,
          model,
          owner,
          markers,
        );

        onValidate?.(markers);
      }
    }
  }, [isEditorReady, onValidate]);

  function disposeEditor() {
    subscriptionRef.current?.dispose();

    if (keepCurrentModel) {
      saveViewState && viewStates.set(path, editorRef.current.saveViewState());
    } else {
      editorRef.current.getModel()?.dispose();
    }

    editorRef.current.dispose();
  }

  return (
    <MonacoContainer
      width={width}
      height={height}
      isEditorReady={isEditorReady}
      loading={loading}
      _ref={containerRef}
      className={className}
      wrapperClassName={wrapperClassName}
    />
  );
}

export default Editor;