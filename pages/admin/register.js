/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/destructuring-assignment */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react';

import axiosInstance from '../../api/axios';

// import Navbar from '../../components/navbar/Navbar';

import { AuthContext } from '../../context/AuthContext';

function Register() {
  const history = useRouter();
  const { user, login } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.admin) {
      history.push('/admin/events');
    } else if (user) {
      history.push('/event');
    }
  }, []);

  const [value, setValue] = useState({
    email: '',
    password: '',
    cnfpassword: '',
    name: 'HNCC',
  });
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (value.cnfpassword !== value.password) {
      setErrMsg('Passwords do not match');
    }
    try {
      const res = await axiosInstance({
        method: 'post',
        url: '/admin/register',
        data: value,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: false,
      });
      const { data } = res.data;
      login(data);
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg(err.response.data.error);
      } else {
        setErrMsg('Unknown Error');
      }
    }
  };

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };
  if (errMsg) {
    //
  }
  return (
    <>
      {/* <Navbar /> */}
      <div className="RegisterForm">
        <div className="formHeading">Admin Register</div>
        <div className="RegisterFormWrapper">
          <img src="img/formImg.png" alt="" />
          <form>
            <div className="formLineBlock">
              <select
                defaultValue={value.name}
                name="name"
                onChange={handleChange}
              >
                <option value="CES">Chemical Engineering Society</option>
                <option value="PIES">
                  Production and Industrial Engineering Society
                </option>
                <option value="EES">Electrical Engineering Society</option>
                <option value="HNCC">HnCC</option>
                <option value="IETE">IETE</option>
                <option value="ISTE">ISTE</option>
                <option value="MES">Mechanical Engineering Society</option>
                <option value="MC">Model Club</option>
                <option value="SAE">SAE India</option>
              </select>
            </div>
            <div className="formLineBlock">
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                placeholder="Enter your Club Email"
              />
            </div>
            <div className="formLineBlock">
              <input
                required
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Enter Password"
              />
            </div>
            <div className="formLineBlock">
              <input
                required
                type="password"
                name="cnfpassword"
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </div>

            <input type="submit" onClick={handleSubmit} />
            <span className="Already">
              Already Have Account?{' '}
              <Link href="/admin/login" legacyBehavior>
                <a>Login</a>
              </Link>
            </span>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
