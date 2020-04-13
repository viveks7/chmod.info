import React, { useEffect } from 'react';
import SubjectHeader from '../src/components/subjectHeader';
import {
  TableContainer, TableHead, TableRow, TableCell,
  TableBody, Table, makeStyles,
  Checkbox, Box, FormControl, FormLabel,
  FormGroup, FormControlLabel, Divider, Grid
} from '@material-ui/core';
import PermissionService from '../src/utils/permissionService';
import { PermissionModel, PermissionLoggingOptions, PermissionResult } from '../src/models/permissionModel';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import PermissionDisplay from '../src/components/permissionDisplay';

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
  tableWrapper: {
    marginTop: '20px',
  },
  modeOptions: {
    margin: '10px 6px 10px 6px'
  },
  modeOptionItem: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  loggingOptions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px'
  },
  loggingBtn: {
    fontSize: '0.75rem'
  }
});

const permissionService = new PermissionService();

const Calculator = () => {

  const header = {
    header: 'chmod calculator',
    subHeader: 'An easy to use, simple chmod calculator',
  };

  const [permissionResult, setPermissionResult] = React.useState<PermissionResult>(null);

  useEffect(() => {
    var newPerms = { ...perms };
    updatePermission(newPerms);
  }, []);

  const [alignment, setAlignment] = React.useState<string | null>('left');

  const handleOutputChange = (event, newAlignment: string | null) => {
    setAlignment(newAlignment);
    var newPerms = { ...perms };
    newPerms.logging = PermissionLoggingOptions[event.target.textContent];
    updatePermission(newPerms);
  };

  const styles = useStyles({});

  const [perms, setPerms] = React.useState<PermissionModel>({
    owner: [0, 0, 0],
    group: [0, 0, 0],
    all: [0, 0, 0,],
    setgid: false,
    setuid: false,
    stickybit: false,
    fileOptions: {
      folderOptions: {
        recursive: false,
        preserveRoot: false
      },
      referenceFile: ''
    },
    logging: PermissionLoggingOptions.Default
  });

  const handlePermChange = (event, index: number) => {
    var newPerms = { ...perms };
    newPerms[event.target.name][index] = Number(event.target.checked);
    updatePermission(newPerms);
  };

  const handleModeChange = (event) => {
    var newPerms = { ...perms };
    newPerms[event.target.name] = event.target.checked;
    updatePermission(newPerms);
  }

  const handleRecursionChange = (event) => {
    var newPerms = { ...perms };
    newPerms.fileOptions.folderOptions.recursive = event.target.checked;

    if(newPerms.fileOptions.folderOptions.preserveRoot && !event.target.checked) {
      newPerms.fileOptions.folderOptions.preserveRoot = false;
    }

    updatePermission(newPerms);
  }

  const handlePreserveRootChange = (event) => {
    var newPerms = { ...perms };
    newPerms.fileOptions.folderOptions.preserveRoot = event.target.checked;

    updatePermission(newPerms);
  }

  const updatePermission = (value: PermissionModel) => {
    setPermissionResult(permissionService.computeResult(value));
    setPerms(value);
  }

  const handleFileReference = (event) => {
    var newPerms = { ...perms };

    if(event.target.checked) {
      // code to be added.
    } else {
      newPerms.fileOptions.folderOptions.preserveRoot = event.target.checked;
    }
    updatePermission(newPerms);
  }

  return (
    <div>
      <SubjectHeader {...header} />
      <Box borderTop={1} borderBottom={0} borderColor="grey.700" className="tableWrapper">
        <TableContainer>
          <Table className={styles.table} aria-label="permission table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Permissions</TableCell>
                <TableCell align="center">Owner</TableCell>
                <TableCell align="center">Group</TableCell>
                <TableCell align="center">Others</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">Read</TableCell>
                <TableCell align="center">
                  <Checkbox checked={Boolean(perms.owner[0])} name="owner" onChange={(e) => handlePermChange(e, 0)} />
                </TableCell>
                <TableCell align="center">
                  <Checkbox checked={Boolean(perms.group[0])} name="group" onChange={(e) => handlePermChange(e, 0)} />
                </TableCell>
                <TableCell align="center">
                  <Checkbox checked={Boolean(perms.all[0])} name="all" onChange={(e) => handlePermChange(e, 0)} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Write</TableCell>
                <TableCell align="center">
                  <Checkbox checked={Boolean(perms.owner[1])} name="owner" onChange={(e) => handlePermChange(e, 1)} />
                </TableCell>
                <TableCell align="center">
                  <Checkbox checked={Boolean(perms.group[1])} name="group" onChange={(e) => handlePermChange(e, 1)} />
                </TableCell>
                <TableCell align="center">
                  <Checkbox checked={Boolean(perms.all[1])} name="all" onChange={(e) => handlePermChange(e, 1)} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">Update</TableCell>
                <TableCell align="center">
                  <Checkbox checked={Boolean(perms.owner[2])} name="owner" onChange={(e) => handlePermChange(e, 2)} />
                </TableCell>
                <TableCell align="center">
                  <Checkbox checked={Boolean(perms.group[2])} name="group" onChange={(e) => handlePermChange(e, 2)} />
                </TableCell>
                <TableCell align="center">
                  <Checkbox checked={Boolean(perms.all[2])} name="all" onChange={(e) => handlePermChange(e, 2)} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <PermissionDisplay permissionValue={permissionResult} />

        <Divider />
        <Grid container direction="row" justify="center" alignItems="center" spacing={2} className={styles.modeOptions}>         
          <Grid item xs={6} className={styles.modeOptionItem}>
            <FormControl component="fieldset" >
              <FormLabel component="legend">Special Modes</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={perms.setuid} onChange={handleModeChange} name="setuid" />}
                  label="setuid" />
                <FormControlLabel
                  control={<Checkbox checked={perms.setgid} onChange={handleModeChange} name="setgid" />}
                  label="setgid" />
                <FormControlLabel
                  control={<Checkbox checked={perms.stickybit} onChange={handleModeChange} name="stickybit" />}
                  label="stickybit" />
              </FormGroup>
            </FormControl>
          </Grid>

          <Grid item xs={6} className={styles.modeOptionItem}>
            <FormControl component="fieldset">
              <FormLabel component="legend">File Options</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={perms.fileOptions.folderOptions.recursive} onChange={handleRecursionChange}/>}
                  label="Recursive" />
                <FormControlLabel
                  control={<Checkbox checked={perms.fileOptions.folderOptions.preserveRoot} disabled={!perms.fileOptions.folderOptions.recursive} onChange={handlePreserveRootChange} />}
                  label="Preserve Root" />
                <FormControlLabel
                  control={<Checkbox checked={Boolean(perms.fileOptions.referenceFile)} onChange={handleFileReference} name="stickybit" />}
                  label="File Reference" />
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
        <div className={styles.loggingOptions}>
          <span>Output Options</span>
          <ToggleButtonGroup value={alignment} exclusive onChange={handleOutputChange} aria-label="text alignment" size="small">
            <ToggleButton value="left" aria-label="left aligned" className={styles.loggingBtn}>
              Default
            </ToggleButton>
            <ToggleButton value="center" aria-label="centered" className={styles.loggingBtn}>
              Verbose
            </ToggleButton>
            <ToggleButton value="right" aria-label="right aligned" className={styles.loggingBtn}>
              Changes
            </ToggleButton>
            <ToggleButton value="justify" aria-label="justified" className={styles.loggingBtn}>
              Silent
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Box>
    </div>
  );
};

export default Calculator;
