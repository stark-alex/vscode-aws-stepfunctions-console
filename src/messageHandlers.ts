import * as vscode from 'vscode';
import { fetchStateMachines, fetchStateMachineDefinition, fetchExecutions, fetchExecution } from './api';
import { AslVisualizationManager } from './visualizeStateMachine/aslVisualizationManager';
import { StepFunctions } from 'aws-sdk';
import { getStateMachinesWebview, getStateMachineExecutionsWebview, getStateMachineExecutionWebview } from './views/stateMachines';

export function handleGetStateMachines(context: vscode.ExtensionContext, panel: vscode.WebviewPanel, stepFunctions: StepFunctions) {
    fetchStateMachines(stepFunctions).then(async (stateMachines: StepFunctions.StateMachineList) => {
        panel.webview.html = getStateMachinesWebview(context, panel, stateMachines);
    });
}

export function handleGetStateMachineDefinition(context: vscode.ExtensionContext, stepFunctions: StepFunctions, message: any) {
    fetchStateMachineDefinition(stepFunctions, message.arn).then(async (stateMachineDescription: StepFunctions.DescribeStateMachineOutput) => {
        const manager = new AslVisualizationManager(context);
        await manager.visualizeStateMachine(stateMachineDescription.name, stateMachineDescription.definition);
    });
}

export function handleGetStateMachineExecutions(context: vscode.ExtensionContext, panel: vscode.WebviewPanel, stepFunctions: StepFunctions, message: any) {
    fetchExecutions(stepFunctions, message.arn).then((executionList: StepFunctions.ExecutionList) => {
        panel.webview.html = getStateMachineExecutionsWebview(context, panel, message.arn, executionList);
    });
}

export function handleGetStateMachineExecution(context: vscode.ExtensionContext, panel: vscode.WebviewPanel, stepFunctions: StepFunctions, message: any) {
    fetchExecution(stepFunctions, message.executionArn).then((execution: StepFunctions.GetExecutionHistoryOutput) => {
        panel.webview.html = getStateMachineExecutionWebview(context, panel, message.stateMachineArn, execution);
    });
}
